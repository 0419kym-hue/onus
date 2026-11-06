-- ON:US 수상작 올리기: 수상증명서(상장·확인서) 첨부를 필수로 하고, 증명서는 운영자만 열어 보며 확인 뒤 삭제합니다.
-- 증명서 파일은 이미 있는 비공개 저장소 onus-evidence 에 저장됩니다(읽기·삭제는 운영자만, 이미지·PDF 5MB).
-- cert_path 컬럼은 공개 읽기 권한(select grant)에 포함하지 않아 누구도 조회할 수 없고, 운영자 전용 함수로만 읽습니다.
-- 20261106120000_onus_work_submissions.sql 을 먼저 적용한 뒤 적용됩니다. 이 파일은 GitHub push 로 자동 실행되지 않습니다.
begin;

alter table public.onus_work_submissions add column if not exists cert_path text check (cert_path is null or char_length(cert_path) <= 200);
grant insert (cert_path) on public.onus_work_submissions to anon, authenticated;

drop policy if exists "onus_work_submissions_insert_open" on public.onus_work_submissions;
create policy "onus_work_submissions_insert_open" on public.onus_work_submissions for insert to anon, authenticated
 with check (status = 'pending' and consent and image_path is not null and cert_path is not null);

-- 운영자 전용: 대기 목록(증명서 경로 포함)
drop function if exists public.onus_admin_work_pending();
create or replace function public.onus_admin_work_pending()
returns table (id uuid, title text, contest_title text, contest_year integer, award text, fields text, description text, prep_note text, major text, nickname text, image_path text, cert_path text, created_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
 if not public.onus_is_admin() then raise exception 'admin only' using errcode = '42501'; end if;
 return query select s.id, s.title, s.contest_title, s.contest_year, s.award, s.fields, s.description, s.prep_note, s.major, s.nickname, s.image_path, s.cert_path, s.created_at
  from public.onus_work_submissions s where s.status = 'pending' order by s.created_at;
end $$;

-- 운영자 전용: 승인/반려. 증명서 경로는 항상 돌려줘 삭제하게 하고(기록에서도 비움), 이미지는 반려할 때만 돌려줍니다.
drop function if exists public.onus_admin_work_decide(uuid, boolean, text);
create or replace function public.onus_admin_work_decide(p_id uuid, p_approve boolean, p_reason text)
returns table (image_path text, cert_path text)
language plpgsql security definer set search_path = public as $$
declare s public.onus_work_submissions;
begin
 if not public.onus_is_admin() then raise exception 'admin only' using errcode = '42501'; end if;
 select * into s from public.onus_work_submissions where id = p_id and status = 'pending';
 if not found then return; end if;
 if p_approve then
  update public.onus_work_submissions set status = 'approved', reviewed_at = now(), cert_path = null where id = p_id;
  return query select null::text, s.cert_path;
 else
  update public.onus_work_submissions set status = 'rejected', reject_reason = left(coalesce(p_reason, ''), 300), reviewed_at = now(), image_path = null, cert_path = null where id = p_id;
  return query select s.image_path, s.cert_path;
 end if;
end $$;

revoke all on function public.onus_admin_work_pending(), public.onus_admin_work_decide(uuid, boolean, text) from public;
grant execute on function public.onus_admin_work_pending(), public.onus_admin_work_decide(uuid, boolean, text) to authenticated;

commit;

select count(*) as onus_work_submissions from public.onus_work_submissions;
