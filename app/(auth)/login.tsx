// app/(auth)/login.tsx
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { supabase } from '../../lib/supabase';
// expo-web-browser는 이제 안 써도 됩니다 (WebBrowser.maybeCompleteAuthSession() 줄도 삭제)

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

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string>('');

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
        queryParams:
          provider === 'google'
            ? { prompt: 'select_account' }   // 구글: 매번 계정 선택 화면 강제
            : { prompt: 'login' },           // 카카오: 매번 로그인 화면 강제
      },
    });

      if (error) throw error;
    if (!data?.url) throw new Error('인증 URL을 생성하지 못했습니다.');

    console.log('[DEBUG] signInWithOAuth data.url:', data.url);

    // 외부 브라우저 대신, 앱 안 WebView로 로그인 화면을 띄운다
    setAuthUrl(data.url);
  } catch (err) {
    console.error('[ERROR] 소셜 로그인 실패:', err);
    setLoading(false);
  }
};

const handleShouldStartLoad = (request: { url: string }) => {
  const url = request.url;

  // redirectTo로 가려고 하든, localhost로 가려고 하든, access_token이 붙어있으면 로그인 성공
  if (url.includes('access_token=') || (redirectUrl && url.startsWith(redirectUrl))) {
    setAuthUrl(null); // WebView 닫기 (실제 로딩 막기)

    const params = extractParamsFromUrl(url);
    const access_token = params['access_token'];
    const refresh_token = params['refresh_token'];

    if (!access_token || !refresh_token) {
      console.warn('[DEBUG] 토큰을 찾지 못함. url:', url);
      setLoading(false);
      return false; // 이 요청은 실제로 로딩하지 않음
    }

    supabase.auth.setSession({ access_token, refresh_token }).then(({ data: sessionData, error: sessionError }) => {
      setLoading(false);

      if (sessionError) {
        console.error('[ERROR] setSession 실패:', sessionError);
        return;
      }

      console.log('[DEBUG] 로그인 성공:', JSON.stringify(sessionData));
      router.replace('/(tabs)' as any);
    });

    return false; // 이 요청은 실제로 로딩하지 않음 (ERR_CONNECTION_REFUSED 방지)
  }

  return true; // 그 외의 정상적인 페이지 이동은 허용
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

      <Modal visible={!!authUrl} animationType="slide">
        {authUrl && (
          <WebView
            source={{ uri: authUrl }}
            onShouldStartLoadWithRequest={handleShouldStartLoad}   // ← onNavigationStateChange 대신 이걸로 교체
            style={{ flex: 1, marginTop: 40 }}
          />
        )}
        <TouchableOpacity
          style={{ padding: 16, alignItems: 'center' }}
          onPress={() => {
            setAuthUrl(null);
            setLoading(false);
          }}
        >
          <Text>닫기</Text>
        </TouchableOpacity>
      </Modal>

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