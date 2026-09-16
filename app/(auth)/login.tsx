// app/(auth)/login.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

// 웹 브라우저 세션 완료 처리
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = async (provider: 'kakao' | 'google') => {
    try {
      setLoading(true);

      // 1. Expo scheme 기반 리디렉션 주소 생성 (mongle://)
      const redirectTo = AuthSession.makeRedirectUri({
        scheme: 'mongle',
      });

      // 2. Supabase OAuth URL 요청
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          skipBrowserRedirect: true, // 앱 환경에서 브라우저를 직접 제어하기 위해 설정
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error('인증 URL을 생성하지 못했습니다.');

      // 3. 브라우저로 Supabase 인증창 띄우기
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      // 4. 로그인 성공 후 돌아온 주소에서 토큰 파싱 및 세션 수동 저장
      if (result.type === 'success' && result.url) {
        const params = extractParamsFromUrl(result.url);
        
        if (params.access_token && params.refresh_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });

          if (sessionError) throw sessionError;

          // 로그인 성공 시 탭 화면으로 이동
          router.replace('/(tabs)');
        }
      } else if (result.type === 'cancel' || result.type === 'dismiss') {
        // 사용자가 로그인 창을 그냥 닫은 경우 에러 없이 종료
        console.log('사용자가 로그인을 취소했습니다.');
      }
    } catch (err: any) {
      Alert.alert('로그인 실패', err.message || '인증 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // URL 파라미터(access_token, refresh_token) 추출 헬퍼 함수
  const extractParamsFromUrl = (url: string) => {
    const regex = /[#?]([^#]*)/;
    const match = url.match(regex);
    if (!match) return {};
    const params = new URLSearchParams(match[1]);
    return {
      access_token: params.get('access_token'),
      refresh_token: params.get('refresh_token'),
    };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>몽글 (mongle)</Text>
      <Text style={styles.subtitle}>간편하게 로그인하고 시작하세요</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#333" style={{ marginVertical: 20 }} />
      ) : (
        <>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#FEE500' }]} 
            onPress={() => handleSocialLogin('kakao')}
          >
            <Text style={[styles.buttonText, { color: '#000000' }]}>카카오로 시작하기</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DDDDDD' }]} 
            onPress={() => handleSocialLogin('google')}
          >
            <Text style={[styles.buttonText, { color: '#333333' }]}>구글로 시작하기</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 40 },
  button: { width: '100%', height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  buttonText: { fontSize: 16, fontWeight: '600' },
});