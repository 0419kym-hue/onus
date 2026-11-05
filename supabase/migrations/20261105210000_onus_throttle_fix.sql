-- 수정: 도배 방지 함수가 호출한 사람의 권한으로 실행되어, 인증 신청 테이블에서는 created_at 을 읽지 못해 신청이 막혔습니다.
-- 함수를 security definer 로 바꿔 모든 행을 셀 수 있게 합니다. 동작(1분에 30건 초과 시 잠시 막기)은 그대로입니다.
-- 기존 테이블(hy_company_jobs, careerly_jobs, applications)은 수정하지 않습니다.
begin;

create or replace function public.onus_throttle() returns trigger
language plpgsql security definer set search_path = public as $$
declare n integer;
begin
 execute format('select count(*) from public.%I where created_at > now() - interval ''1 minute''', tg_table_name) into n;
 if n >= 30 then raise exception 'too many requests, try again in a minute' using errcode = 'P0001'; end if;
 return new;
end $$;
revoke all on function public.onus_throttle() from public;

commit;
