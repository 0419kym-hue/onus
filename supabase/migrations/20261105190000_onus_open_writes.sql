-- ON:US 시범 운영: 로그인 없이 닉네임과 "스스로 고른 유형"으로 글·댓글을 남길 수 있게 합니다.
-- 유형은 본인이 고르는 것이며 인증되지 않습니다. 이메일·전화번호 등 개인정보는 저장하지 않습니다.
-- 기존 테이블(hy_company_jobs, careerly_jobs, applications)은 수정하지 않습니다. 이 파일은 GitHub push로 자동 실행되지 않습니다.
-- 삭제는 글을 쓸 때 브라우저가 만든 비밀 키(edit_key)를 아는 사람만 할 수 있고, edit_key 컬럼은 누구도 조회할 수 없습니다.
begin;

alter table public.onus_posts alter column author_id drop not null;
alter table public.onus_comments alter column author_id drop not null;

alter table public.onus_posts
 add column if not exists nickname text check (nickname is null or char_length(nickname) between 2 and 20),
 add column if not exists author_type text check (author_type is null or author_type in ('maker','award','entry','senior','junior','general')),
 add column if not exists edit_key text check (edit_key is null or char_length(edit_key) between 20 and 100);
alter table public.onus_comments
 add column if not exists nickname text check (nickname is null or char_length(nickname) between 2 and 20),
 add column if not exists author_type text check (author_type is null or author_type in ('maker','award','entry','senior','junior','general')),
 add column if not exists edit_key text check (edit_key is null or char_length(edit_key) between 20 and 100);

-- 이전(로그인 방식) 쓰기 경로는 닫고, 열린 쓰기 경로 하나만 둡니다.
drop policy if exists "onus_posts_insert_own" on public.onus_posts;
drop policy if exists "onus_posts_update_own" on public.onus_posts;
drop policy if exists "onus_posts_delete_own" on public.onus_posts;
drop policy if exists "onus_comments_insert_own" on public.onus_comments;
drop policy if exists "onus_comments_delete_own" on public.onus_comments;
revoke all on table public.onus_posts, public.onus_comments from anon, authenticated;

-- 읽기: edit_key, author_id 는 제외하고 공개 컬럼만
grant select (id, category, title, body, contest_title, place, contact_url, status, nickname, author_type, created_at) on public.onus_posts to anon, authenticated;
grant select (id, target_type, target_id, parent_id, body, claims_maker, nickname, author_type, created_at) on public.onus_comments to anon, authenticated;

-- 쓰기: 정해진 컬럼만 새 글로 추가 가능 (수정·삭제는 아래 함수로만)
grant insert (id, category, title, body, contest_title, place, contact_url, nickname, author_type, edit_key) on public.onus_posts to anon, authenticated;
grant insert (id, target_type, target_id, parent_id, body, nickname, author_type, edit_key) on public.onus_comments to anon, authenticated;

create policy "onus_posts_insert_open" on public.onus_posts for insert to anon, authenticated
 with check (author_id is null and nickname is not null and edit_key is not null and author_type is not null);
create policy "onus_comments_insert_open" on public.onus_comments for insert to anon, authenticated
 with check (author_id is null and nickname is not null and edit_key is not null and author_type is not null);

-- 도배 방지: 같은 테이블에 1분 안에 30건 넘게 들어오면 잠시 막습니다.
create or replace function public.onus_throttle() returns trigger language plpgsql as $$
declare n integer;
begin
 execute format('select count(*) from public.%I where created_at > now() - interval ''1 minute''', tg_table_name) into n;
 if n >= 30 then raise exception 'too many requests, try again in a minute' using errcode = 'P0001'; end if;
 return new;
end $$;
drop trigger if exists onus_posts_throttle on public.onus_posts;
create trigger onus_posts_throttle before insert on public.onus_posts for each row execute function public.onus_throttle();
drop trigger if exists onus_comments_throttle on public.onus_comments;
create trigger onus_comments_throttle before insert on public.onus_comments for each row execute function public.onus_throttle();

-- 삭제·상태 변경은 비밀 키가 맞을 때만
create or replace function public.onus_delete_comment(p_id uuid, p_key text) returns boolean
language plpgsql security definer set search_path = public as $$
declare n integer;
begin
 delete from public.onus_comments where id = p_id and edit_key is not null and edit_key = p_key;
 get diagnostics n = row_count; return n > 0;
end $$;
create or replace function public.onus_delete_post(p_id uuid, p_key text) returns boolean
language plpgsql security definer set search_path = public as $$
declare n integer;
begin
 delete from public.onus_posts where id = p_id and edit_key is not null and edit_key = p_key;
 get diagnostics n = row_count; return n > 0;
end $$;
create or replace function public.onus_set_post_status(p_id uuid, p_key text, p_status text) returns boolean
language plpgsql security definer set search_path = public as $$
declare n integer;
begin
 if p_status not in ('open','closed') then return false; end if;
 update public.onus_posts set status = p_status where id = p_id and edit_key is not null and edit_key = p_key;
 get diagnostics n = row_count; return n > 0;
end $$;
revoke all on function public.onus_delete_comment(uuid, text), public.onus_delete_post(uuid, text), public.onus_set_post_status(uuid, text, text) from public;
grant execute on function public.onus_delete_comment(uuid, text), public.onus_delete_post(uuid, text), public.onus_set_post_status(uuid, text, text) to anon, authenticated;

commit;

select count(*) as onus_posts from public.onus_posts;
