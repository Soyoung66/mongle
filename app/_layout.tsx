import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: Colors.background, card: Colors.background },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.otf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={theme}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
        {/* 스플래시 → 온보딩 → 회원가입 → 홈 */}
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen name="(auth)/login" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />

        {/* 홈 → 로딩 → 몽글이 탄생 → 말랑이 만지기 → 보관/놓아주기 선택 → 보관 완료 */}
        <Stack.Screen name="mongle-loading" options={{ animation: 'fade' }} />
        <Stack.Screen name="mongle-born" options={{ animation: 'fade' }} />
        <Stack.Screen name="mongle-touch" options={{ animation: 'fade' }} />
        <Stack.Screen name="mongle-keep" options={{ animation: 'fade' }} />
        <Stack.Screen name="mongle-keep-done" options={{ animation: 'fade' }} />

        {/* 설정 → 회원 탈퇴 확인 */}
        <Stack.Screen name="withdraw" options={{ animation: 'fade' }} />

        {/* 보관함 → 보관한 몽글이 보기 → 삭제 알림 */}
        <Stack.Screen name="archive/[date]" />
        <Stack.Screen name="archive/delete" options={{ animation: 'fade' }} />
      </Stack>
    </ThemeProvider>
  );
}
