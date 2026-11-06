-- ON:US 수상작 올리기: 학생이 자기 수상·출품작을 이미지와 함께 올리면 운영자가 확인하고 승인한 작품만 아카이브에 보입니다.
-- 올릴 때는 이름·학번·연락처를 받지 않고, 닉네임(2~20자)과 작품 정보만 받습니다. 운영자는 onus_admins 에 등록된 이메일 계정만 가능합니다.
-- 기존 테이블(hy_company_jobs, careerly_jobs, applications, onus_*)은 수정하지 않고 새 테이블·저장소만 추가합니다.
-- 이 파일은 GitHub push 로 자동 실행되지 않습니다. Supabase CLI 로 직접 적용해야 합니다(npx supabase db push).
begin;

create table if not exists public.onus_work_submissions (
 id uuid primary key,
 title text not null check (char_length(title) between 2 and 80),
 contest_title text not null check (char_length(contest_title) between 2 and 100),
 contest_year integer not null check (contest_year between 2000 and 2100),
 award text not null check (char_length(award) between 1 and 40),
 fields text check (fields is null or char_length(fields) <= 100),
 description text not null check (char_length(description) between 10 and 600),
 prep_note text check (prep_note is null or char_length(prep_note) <= 60),
 major text check (major is null or char_length(major) <= 40),
 nickname text not null check (char_length(nickname) between 2 and 20),
 image_path text,
 consent boolean not null default false check (consent),
 claim_key text not null check (char_length(claim_key) between 20 and 100),
 status text not null default 'pending' check (status in ('pending','approved','rejected')),
 reject_reason text check (reject_reason is null or char_length(reject_reason) <= 300),
 created_at timestamptz not null default now(),
 reviewed_at timestamptz
);
alter table public.onus_work_submissions enable row level security;
revoke all on table public.onus_work_submissions from anon, authenticated;

-- 읽기: 승인된 작품의 공개 컬럼만(claim_key·반려 사유·동의 여부는 읽을 수 없음)
grant select (id, title, contest_title, contest_year, award, fields, description, prep_note, major, nickname, image_path, created_at)
 on public.onus_work_submissions to anon, authenticated;
drop policy if exists "onus_work_submissions_read_approved" on public.onus_work_submissions;
create policy "onus_work_submissions_read_approved" on public.onus_work_submissions for select to anon, authenticated using (status = 'approved');

-- 쓰기: 정해진 컬럼만 새로 추가. 항상 '대기' 상태로 들어가고 동의와 이미지가 있어야 합니다.
grant insert (id, title, contest_title, contest_year, award, fields, description, prep_note, major, nickname, image_path, consent, claim_key)
 on public.onus_work_submissions to anon, authenticated;
drop policy if exists "onus_work_submissions_insert_open" on public.onus_work_submissions;
create policy "onus_work_submissions_insert_open" on public.onus_work_submissions for insert to anon, authenticated
 with check (status = 'pending' and consent and image_path is not null);

-- 도배 방지(기존 함수 재사용): 1분에 30건 넘으면 잠시 막음
drop trigger if exists onus_work_submissions_throttle on public.onus_work_submissions;
create trigger onus_work_submissions_throttle before insert on public.onus_work_submissions for each row execute function public.onus_throttle();

-- 신청자는 id+비밀 키로 자기 신청의 상태만 확인할 수 있습니다.
create or replace function public.onus_work_status(p_id uuid, p_key text)
returns table (status text, reject_reason text, title text)
language sql stable security definer set search_path = public as $$
 select s.status, s.reject_reason, s.title from public.onus_work_submissions s where s.id = p_id and s.claim_key = p_key;
$$;

-- 운영자 전용: 대기 목록
create or replace function public.onus_admin_work_pending()
returns table (id uuid, title text, contest_title text, contest_year integer, award text, fields text, description text, prep_note text, major text, nickname text, image_path text, created_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
 if not public.onus_is_admin() then raise exception 'admin only' using errcode = '42501'; end if;
 return query select s.id, s.title, s.contest_title, s.contest_year, s.award, s.fields, s.description, s.prep_note, s.major, s.nickname, s.image_path, s.created_at
  from public.onus_work_submissions s where s.status = 'pending' order by s.created_at;
end $$;

-- 운영자 전용: 승인/반려. 반려하면 삭제해야 할 이미지 경로를 돌려줍니다(승인이면 null).
create or replace function public.onus_admin_work_decide(p_id uuid, p_approve boolean, p_reason text)
returns text language plpgsql security definer set search_path = public as $$
declare s public.onus_work_submissions;
begin
 if not public.onus_is_admin() then raise exception 'admin only' using errcode = '42501'; end if;
 select * into s from public.onus_work_submissions where id = p_id and status = 'pending';
 if not found then return null; end if;
 if p_approve then
  update public.onus_work_submissions set status = 'approved', reviewed_at = now() where id = p_id;
  return null;
 end if;
 update public.onus_work_submissions set status = 'rejected', reject_reason = left(coalesce(p_reason, ''), 300), reviewed_at = now(), image_path = null where id = p_id;
 return s.image_path;
end $$;

revoke all on function public.onus_work_status(uuid, text), public.onus_admin_work_pending(), public.onus_admin_work_decide(uuid, boolean, text) from public;
grant execute on function public.onus_work_status(uuid, text) to anon, authenticated;
grant execute on function public.onus_admin_work_pending(), public.onus_admin_work_decide(uuid, boolean, text) to authenticated;

-- 작품 이미지 저장소(공개 읽기): 누구나 올릴 수 있지만(5MB, JPG·PNG·WEBP만) 삭제는 운영자만 가능합니다.
-- 승인 전 이미지도 주소를 알면 볼 수 있으므로 주소는 무작위 값이고, 반려하면 운영자가 파일을 삭제합니다.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('onus-works', 'onus-works', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create or replace function public.onus_works_storage_ok() returns boolean language sql stable security definer set search_path = public, storage as $$
 select (select count(*) from storage.objects where bucket_id = 'onus-works' and created_at > now() - interval '1 minute') < 20;
$$;
revoke all on function public.onus_works_storage_ok() from public;
grant execute on function public.onus_works_storage_ok() to anon, authenticated;

drop policy if exists "onus_works_insert" on storage.objects;
create policy "onus_works_insert" on storage.objects for insert to anon, authenticated
 with check (bucket_id = 'onus-works' and (storage.foldername(name))[1] ~ '^[0-9a-f-]{36}$' and public.onus_works_storage_ok());
drop policy if exists "onus_works_admin_delete" on storage.objects;
create policy "onus_works_admin_delete" on storage.objects for delete to authenticated
 using (bucket_id = 'onus-works' and public.onus_is_admin());

commit;

select count(*) as onus_work_submissions from public.onus_work_submissions;
