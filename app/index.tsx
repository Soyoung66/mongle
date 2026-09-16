// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // 앱을 켜자마자 로그인 화면으로 이동시킵니다.
  return <Redirect href="/(auth)/login" />;
}