// app/index.tsx
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // 로그인이 되어 있으면 탭(홈) 화면으로 이동
        router.replace('/(tabs)' as any);
      } else {
        // 로그인이 안 되어 있으면 로그인 화면으로 이동
        router.replace('/(auth)/login' as any);
      }
    } catch (error) {
      console.error('세션 확인 중 오류:', error);
      router.replace('/(auth)/login' as any);
    } finally {
      setLoading(false);
    }
  };

  // 세션을 확인하는 동안 로딩 스피너 표시
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#333" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});