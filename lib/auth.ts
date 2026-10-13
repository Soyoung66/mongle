import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

import { supabase } from '@/lib/supabase';

// 쌓여 있는 화면을 모두 닫고 회원가입(로그인) 화면으로 이동
export function goToLogin() {
  if (router.canDismiss()) router.dismissAll();
  router.replace('/(auth)/login');
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error('[ERROR] 로그아웃 실패:', error);
  goToLogin();
}

// 회원탈퇴: Supabase에서 계정(카카오/구글 연동 정보 포함)을 삭제하고 기기에 남은 기록도 지운다.
// delete_my_account 함수는 백엔드(minsang/backend 브랜치 supabase/sql/004_delete_account.sql)에서 관리한다.
// auth.users가 지워지면 profiles, mongles도 on delete cascade로 함께 삭제된다.
export async function withdraw() {
  const { error } = await supabase.rpc('delete_my_account');
  if (error) throw error;

  // 계정이 이미 지워졌으므로 서버 호출 없이 로컬 세션만 정리
  await supabase.auth.signOut({ scope: 'local' });
  await AsyncStorage.clear();
  goToLogin();
}
