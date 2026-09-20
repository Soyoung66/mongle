// app/(auth)/login.tsx
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

// 긴 문자열이 로그에서 잘리지 않도록 나눠서 출력
function logLongString(label: string, value: string, chunkSize = 300) {
  console.log(`[DEBUG] ${label} (총 ${value.length}자):`);
  for (let i = 0; i < value.length; i += chunkSize) {
    console.log(`  [${label} ${i}~${i + chunkSize}]`, value.substring(i, i + chunkSize));
  }
}
// #(fragment) 뒤와 ?(query) 뒤 파라미터를 둘 다 파싱
function extractParamsFromUrl(url: string): Record<string, string> {
  const params: Record<string, string> = {};
  const hashIndex = url.indexOf('#');
  const queryIndex = url.indexOf('?');

  if (hashIndex !== -1) {
    const hashPart = url.substring(hashIndex + 1);
    new URLSearchParams(hashPart).forEach((value, key) => {
      params[key] = value;
    });
  }

  if (queryIndex !== -1) {
    const end = hashIndex !== -1 ? hashIndex : undefined;
    const queryPart = url.substring(queryIndex + 1, end);
    new URLSearchParams(queryPart).forEach((value, key) => {
      params[key] = value;
    });
  }

  return params;
}
// 웹 브라우저 세션 완료 처리
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = async (provider: 'kakao' | 'google') => {
  try {
    setLoading(true);

    console.log('[DEBUG] handleSocialLogin 호출됨, provider:', provider); // ← 새로 추가

    // 1. 리디렉션 주소 생성
    const redirectTo = Linking.createURL('/auth/callback');
    console.log('[DEBUG] redirectTo:', redirectTo);

    // 2. Supabase에 OAuth URL 요청 (skipBrowserRedirect 필수)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;
    if (!data?.url) throw new Error('인증 URL을 생성하지 못했습니다.');

    logLongString('signInWithOAuth data.url', data.url);

    // 3. 브라우저로 인증창 열기 (두 번째 인자에 redirectTo 필수)
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    logLongString('openAuthSessionAsync result', JSON.stringify(result));

    if (result.type !== 'success' || !result.url) {
      console.warn('[DEBUG] 로그인 취소 또는 실패:', result.type);
      return;
    }

    // 4. 콜백 URL에서 토큰 추출 (# 뒤든 ? 뒤든 둘 다 처리)
    const params = extractParamsFromUrl(result.url);
    const access_token = params['access_token'];
    const refresh_token = params['refresh_token'];

    if (!access_token || !refresh_token) {
      console.warn('[DEBUG] 토큰을 찾지 못함. params:', params);
      return;
    }

    // 5. 세션 저장
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (sessionError) throw sessionError;

    console.log('[DEBUG] setSession 완료:', JSON.stringify(sessionData));

    // 6. 세션 확인
    const { data: checkSession } = await supabase.auth.getSession();
    console.log('[DEBUG] getSession() 결과:', JSON.stringify(checkSession));
    // 7. 로그인 성공 → 탭(홈) 화면으로 이동
    router.replace('/(tabs)' as any);
  } catch (err) {
    console.error('[ERROR] 소셜 로그인 실패:', err);
  } finally {
    setLoading(false);
  }
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