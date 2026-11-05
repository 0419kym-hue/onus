create table public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  position text not null,
  name text not null,
  email text not null,
  phone text not null,
  message text not null,
  sheet_synced boolean not null default false
);

-- RLS 켜고 정책 없음 = anon 접근 차단. 서버(service_role)만 접근.
alter table public.applications enable row level security;
