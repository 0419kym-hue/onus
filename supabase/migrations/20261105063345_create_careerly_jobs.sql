-- 커리어리 채용 MCP 공고를 분석용으로 저장하는 별도 테이블입니다.
-- 기존 hy_company_jobs 와 applications 는 수정하지 않습니다. 이 파일은 GitHub push로 자동 실행되지 않습니다.
-- 컬럼은 MCP get_jobs 가 실제로 제공하는 필드만 사용합니다. 공고 본문 원문은 제공되지 않으므로 저장하지 않습니다.
begin;
create table if not exists public.careerly_jobs (
 row_id bigint generated always as identity primary key,
 dataset_version text not null,
 job_id text not null check (job_id ~ '^HYW-[0-9]{4}$'),
 title text not null,
 company text not null,
 url text not null check (url ~ '^https://'),
 role text,
 categories text[] not null default '{}',
 regions text[] not null default '{}',
 min_experience_years numeric,
 max_experience_years numeric,
 entry_level boolean,
 kind text,
 employment_type text,
 summary text,
 responsibilities text,
 requirements text,
 skills text[] not null default '{}',
 deadline timestamptz,
 first_seen_at date,
 last_seen_at date,
 created_at timestamptz not null default now(),
 constraint careerly_jobs_version_job_unique unique (dataset_version, job_id)
);
create index if not exists careerly_jobs_dataset_version_idx on public.careerly_jobs (dataset_version);

-- 읽기: 사이트(publishable key)는 조회만 가능. 쓰기 정책은 만들지 않아 공개 쓰기는 막힙니다.
alter table public.careerly_jobs enable row level security;
revoke all on table public.careerly_jobs from anon, authenticated;
grant select on table public.careerly_jobs to anon, authenticated;
drop policy if exists "careerly_jobs_public_read" on public.careerly_jobs;
create policy "careerly_jobs_public_read" on public.careerly_jobs
for select to anon, authenticated using (true);

-- 적재: 서버 쪽 service_role 과 CLI(관리자 연결)만 사용합니다. 키는 브라우저로 보내지 않습니다.
grant select, insert, update on public.careerly_jobs to service_role;
commit;
