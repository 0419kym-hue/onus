-- ON:US 커뮤니티(닉네임 프로필, 모집·모임 공간·참가 학생 게시글, 코멘트와 댓글).
-- 기존 테이블(hy_company_jobs, careerly_jobs, applications)을 수정하지 않습니다.
-- 이 파일은 GitHub push로 자동 실행되지 않습니다. Supabase CLI로 별도 적용합니다.
-- 보는 것은 누구나(로그인 없이) 가능하고, 쓰는 것만 로그인한 사용자가 자기 글에 한해 할 수 있습니다.
-- 이메일·전화번호 등 개인정보는 이 테이블에 저장하지 않습니다(연락 방법은 https 링크만).
begin;

create table if not exists public.onus_profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 nickname text not null check (char_length(nickname) between 2 and 20),
 created_at timestamptz not null default now()
);

create table if not exists public.onus_posts (
 id uuid primary key default gen_random_uuid(),
 category text not null check (category in ('team','space','participants','talk')),
 title text not null check (char_length(title) between 2 and 80),
 body text not null check (char_length(body) between 2 and 2000),
 contest_title text check (contest_title is null or char_length(contest_title) <= 100),
 place text check (place is null or char_length(place) <= 80),
 contact_url text check (contact_url is null or (contact_url ~ '^https://' and char_length(contact_url) <= 300)),
 status text not null default 'open' check (status in ('open','closed')),
 author_id uuid not null default auth.uid() references public.onus_profiles(id) on delete cascade,
 created_at timestamptz not null default now()
);
create index if not exists onus_posts_category_created_idx on public.onus_posts (category, created_at desc);

create table if not exists public.onus_comments (
 id uuid primary key default gen_random_uuid(),
 target_type text not null check (target_type in ('work','post')),
 target_id text not null check (char_length(target_id) between 1 and 80),
 parent_id uuid references public.onus_comments(id) on delete cascade,
 body text not null check (char_length(body) between 1 and 1000),
 claims_maker boolean not null default false,
 author_id uuid not null default auth.uid() references public.onus_profiles(id) on delete cascade,
 created_at timestamptz not null default now()
);
create index if not exists onus_comments_target_idx on public.onus_comments (target_type, target_id, created_at);

alter table public.onus_profiles enable row level security;
alter table public.onus_posts enable row level security;
alter table public.onus_comments enable row level security;

revoke all on table public.onus_profiles, public.onus_posts, public.onus_comments from anon, authenticated;
grant select on table public.onus_profiles, public.onus_posts, public.onus_comments to anon, authenticated;
grant insert on table public.onus_profiles to authenticated;
grant update (nickname) on table public.onus_profiles to authenticated;
grant insert, delete on table public.onus_posts, public.onus_comments to authenticated;
grant update (title, body, contest_title, place, contact_url, status) on table public.onus_posts to authenticated;

drop policy if exists "onus_profiles_read" on public.onus_profiles;
create policy "onus_profiles_read" on public.onus_profiles for select to anon, authenticated using (true);
drop policy if exists "onus_profiles_insert_own" on public.onus_profiles;
create policy "onus_profiles_insert_own" on public.onus_profiles for insert to authenticated with check (id = auth.uid());
drop policy if exists "onus_profiles_update_own" on public.onus_profiles;
create policy "onus_profiles_update_own" on public.onus_profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "onus_posts_read" on public.onus_posts;
create policy "onus_posts_read" on public.onus_posts for select to anon, authenticated using (true);
drop policy if exists "onus_posts_insert_own" on public.onus_posts;
create policy "onus_posts_insert_own" on public.onus_posts for insert to authenticated with check (author_id = auth.uid());
drop policy if exists "onus_posts_update_own" on public.onus_posts;
create policy "onus_posts_update_own" on public.onus_posts for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());
drop policy if exists "onus_posts_delete_own" on public.onus_posts;
create policy "onus_posts_delete_own" on public.onus_posts for delete to authenticated using (author_id = auth.uid());

drop policy if exists "onus_comments_read" on public.onus_comments;
create policy "onus_comments_read" on public.onus_comments for select to anon, authenticated using (true);
drop policy if exists "onus_comments_insert_own" on public.onus_comments;
create policy "onus_comments_insert_own" on public.onus_comments for insert to authenticated with check (author_id = auth.uid());
drop policy if exists "onus_comments_delete_own" on public.onus_comments;
create policy "onus_comments_delete_own" on public.onus_comments for delete to authenticated using (author_id = auth.uid());

commit;

select count(*) as onus_posts from public.onus_posts;
