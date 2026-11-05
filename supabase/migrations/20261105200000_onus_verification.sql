-- ON:US 경험 인증: 수상 증명서·출품(접수 완료) 확인서를 올리면 운영자가 확인하고 승인합니다.
-- 증빙 서류는 비공개 저장소에만 저장되고 운영자만 볼 수 있으며, 승인·반려 뒤 파일은 삭제됩니다(기록만 남음).
-- 이 시스템은 "서류 확인"이며 "본인 확인"이 아닙니다. 위조 여부는 판별하지 않습니다.
-- 기존 테이블(hy_company_jobs, careerly_jobs, applications)은 수정하지 않습니다. 이 파일은 GitHub push로 자동 실행되지 않습니다.
-- 운영자는 onus_admins 에 등록된 이메일(이메일 확인을 마친 로그인)만 가능하고, 등록은 SQL로 직접 합니다.
begin;

create table if not exists public.onus_admins (
 email text primary key check (email = lower(email))
);
alter table public.onus_admins enable row level security;
revoke all on table public.onus_admins from anon, authenticated;

create or replace function public.onus_is_admin() returns boolean
language sql stable security definer set search_path = public as $$
 select exists (select 1 from public.onus_admins where email = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;
revoke all on function public.onus_is_admin() from public;
grant execute on function public.onus_is_admin() to anon, authenticated;

create table if not exists public.onus_verifications (
 id uuid primary key,
 claim_type text not null check (claim_type in ('award','entry')),
 contest_title text not null check (char_length(contest_title) between 2 and 100),
 contest_year integer not null check (contest_year between 2000 and 2100),
 award_level text check (award_level is null or char_length(award_level) <= 40),
 show_detail text not null default 'none' check (show_detail in ('none','contest','contest_award')),
 doc_path text check (doc_path is null or char_length(doc_path) <= 200),
 claim_key text not null check (char_length(claim_key) between 20 and 100),
 status text not null default 'pending' check (status in ('pending','approved','rejected')),
 reject_reason text check (reject_reason is null or char_length(reject_reason) <= 300),
 public_label text check (public_label is null or char_length(public_label) <= 160),
 created_at timestamptz not null default now(),
 reviewed_at timestamptz
);
alter table public.onus_verifications enable row level security;
revoke all on table public.onus_verifications from anon, authenticated;
-- 누구나 볼 수 있는 것은 "승인된 인증"의 id·종류·공개 문구뿐입니다(대회명·등급은 본인이 공개를 고른 경우에만 문구에 들어갑니다).
grant select (id, claim_type, public_label) on public.onus_verifications to anon, authenticated;
grant insert (id, claim_type, contest_title, contest_year, award_level, show_detail, doc_path, claim_key) on public.onus_verifications to anon, authenticated;
drop policy if exists "onus_verifications_read_approved" on public.onus_verifications;
create policy "onus_verifications_read_approved" on public.onus_verifications for select to anon, authenticated using (status = 'approved');
drop policy if exists "onus_verifications_insert_open" on public.onus_verifications;
create policy "onus_verifications_insert_open" on public.onus_verifications for insert to anon, authenticated
 with check (status = 'pending' and doc_path is not null and public_label is null);
drop trigger if exists onus_verifications_throttle on public.onus_verifications;
create trigger onus_verifications_throttle before insert on public.onus_verifications for each row execute function public.onus_throttle();

-- 신청자는 id+비밀 키로 자기 신청의 상태만 확인할 수 있습니다.
create or replace function public.onus_verification_status(p_id uuid, p_key text)
returns table (status text, reject_reason text, claim_type text, public_label text)
language sql stable security definer set search_path = public as $$
 select v.status, v.reject_reason, v.claim_type, v.public_label from public.onus_verifications v where v.id = p_id and v.claim_key = p_key;
$$;

-- 운영자 전용: 대기 목록 (비밀 키는 반환하지 않음)
create or replace function public.onus_admin_pending()
returns table (id uuid, claim_type text, contest_title text, contest_year integer, award_level text, show_detail text, doc_path text, created_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
 if not public.onus_is_admin() then raise exception 'admin only' using errcode = '42501'; end if;
 return query select v.id, v.claim_type, v.contest_title, v.contest_year, v.award_level, v.show_detail, v.doc_path, v.created_at
  from public.onus_verifications v where v.status = 'pending' order by v.created_at;
end $$;

-- 운영자 전용: 승인/반려. 확인한 내용으로 대회명·연도·등급을 고칠 수 있고, 반환값은 삭제해야 할 서류 경로입니다.
create or replace function public.onus_admin_decide(p_id uuid, p_approve boolean, p_reason text, p_contest text, p_year integer, p_level text)
returns text language plpgsql security definer set search_path = public as $$
declare v public.onus_verifications; base text; label text; old_path text;
begin
 if not public.onus_is_admin() then raise exception 'admin only' using errcode = '42501'; end if;
 select * into v from public.onus_verifications where id = p_id and status = 'pending';
 if not found then return null; end if;
 old_path := v.doc_path;
 if p_approve then
  base := case v.claim_type when 'award' then '수상 경험 인증' else '출품 경험 인증' end;
  label := base || case v.show_detail
   when 'contest' then ' · ' || p_year || ' ' || p_contest
   when 'contest_award' then ' · ' || p_year || ' ' || p_contest || coalesce(' ' || nullif(p_level, ''), '')
   else '' end;
  update public.onus_verifications set status = 'approved', contest_title = p_contest, contest_year = p_year, award_level = nullif(p_level, ''),
   public_label = label, reviewed_at = now(), doc_path = null where id = p_id;
 else
  update public.onus_verifications set status = 'rejected', reject_reason = left(coalesce(p_reason, ''), 300), reviewed_at = now(), doc_path = null where id = p_id;
 end if;
 return old_path;
end $$;
revoke all on function public.onus_verification_status(uuid, text), public.onus_admin_pending(), public.onus_admin_decide(uuid, boolean, text, text, integer, text) from public;
grant execute on function public.onus_verification_status(uuid, text) to anon, authenticated;
grant execute on function public.onus_admin_pending(), public.onus_admin_decide(uuid, boolean, text, text, integer, text) to authenticated;

-- 글·댓글에 인증 연결: 승인된 인증과 비밀 키가 맞을 때만 수상/출품 유형을 쓸 수 있습니다.
alter table public.onus_posts add column if not exists verification_id uuid references public.onus_verifications(id) on delete set null, add column if not exists verification_key text;
alter table public.onus_comments add column if not exists verification_id uuid references public.onus_verifications(id) on delete set null, add column if not exists verification_key text;
grant select (verification_id) on public.onus_posts, public.onus_comments to anon, authenticated;
grant insert (verification_id, verification_key) on public.onus_posts, public.onus_comments to anon, authenticated;

create or replace function public.onus_verify_author() returns trigger language plpgsql security definer set search_path = public as $$
declare t text;
begin
 if new.verification_id is not null then
  select v.claim_type into t from public.onus_verifications v
   where v.id = new.verification_id and v.claim_key = coalesce(new.verification_key, '') and v.status = 'approved';
  if t is null then raise exception 'invalid or unapproved verification' using errcode = 'P0002'; end if;
  new.author_type := t;
 elsif new.author_type in ('award', 'entry') then
  raise exception 'verification required for this type' using errcode = 'P0003';
 end if;
 new.verification_key := null;
 return new;
end $$;
drop trigger if exists onus_posts_verify on public.onus_posts;
create trigger onus_posts_verify before insert on public.onus_posts for each row execute function public.onus_verify_author();
drop trigger if exists onus_comments_verify on public.onus_comments;
create trigger onus_comments_verify before insert on public.onus_comments for each row execute function public.onus_verify_author();

-- 증빙 서류 저장소(비공개). 누구나 올릴 수 있지만(5MB, 이미지·PDF만) 읽기·삭제는 운영자만 가능합니다.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('onus-evidence', 'onus-evidence', false, 5242880, array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do nothing;

create or replace function public.onus_storage_ok() returns boolean language sql stable security definer set search_path = public, storage as $$
 select (select count(*) from storage.objects where bucket_id = 'onus-evidence' and created_at > now() - interval '1 minute') < 20;
$$;
revoke all on function public.onus_storage_ok() from public;
grant execute on function public.onus_storage_ok() to anon, authenticated;

drop policy if exists "onus_evidence_insert" on storage.objects;
create policy "onus_evidence_insert" on storage.objects for insert to anon, authenticated
 with check (bucket_id = 'onus-evidence' and (storage.foldername(name))[1] ~ '^[0-9a-f-]{36}$' and public.onus_storage_ok());
drop policy if exists "onus_evidence_admin_read" on storage.objects;
create policy "onus_evidence_admin_read" on storage.objects for select to authenticated
 using (bucket_id = 'onus-evidence' and public.onus_is_admin());
drop policy if exists "onus_evidence_admin_delete" on storage.objects;
create policy "onus_evidence_admin_delete" on storage.objects for delete to authenticated
 using (bucket_id = 'onus-evidence' and public.onus_is_admin());

commit;

select count(*) as onus_verifications from public.onus_verifications;
