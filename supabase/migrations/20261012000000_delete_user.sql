-- 회원탈퇴: 로그인한 사용자가 자기 계정을 삭제할 수 있게 하는 함수
-- auth.users 에서 지우면 auth.identities(카카오/구글 연동), 세션 등이 함께 삭제된다.
create or replace function public.delete_user()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = auth.uid();
$$;

revoke execute on function public.delete_user() from public, anon;
grant execute on function public.delete_user() to authenticated;
