// app/(auth)/login.tsx — 회원가입 (Figma: 회원가입 211:1021)
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { useDesignFrame } from '@/components/useDesignFrame';
import { Colors, Fonts } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

// #(fragment) 뒤와 ?(query) 뒤 파라미터를 둘 다 파싱
function extractParamsFromUrl(url: string): Record<string, string> {
  const params: Record<string, string> = {};
  const hashIndex = url.indexOf('#');
  const queryIndex = url.indexOf('?');

  if (hashIndex !== -1) {
    new URLSearchParams(url.substring(hashIndex + 1)).forEach((value, key) => {
      params[key] = value;
    });
  }

  if (queryIndex !== -1) {
    const end = hashIndex !== -1 ? hashIndex : undefined;
    new URLSearchParams(url.substring(queryIndex + 1, end)).forEach((value, key) => {
      params[key] = value;
    });
  }

  return params;
}

export default function LoginScreen() {
  const { y } = useDesignFrame();
  const [loading, setLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState('');

  const handleSocialLogin = async (provider: 'kakao' | 'google') => {
    try {
      setLoading(true);

      // 1. 리디렉션 주소 생성
      const redirectTo = Linking.createURL('/auth/callback');
      setRedirectUrl(redirectTo);

      // 2. Supabase에 OAuth URL 요청 (skipBrowserRedirect 필수)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          skipBrowserRedirect: true,
          queryParams:
            provider === 'google'
              ? { prompt: 'select_account' } // 구글: 매번 계정 선택 화면 강제
              : { prompt: 'login' }, // 카카오: 매번 로그인 화면 강제
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error('인증 URL을 생성하지 못했습니다.');

      // 외부 브라우저 대신, 앱 안 WebView로 로그인 화면을 띄운다
      setAuthUrl(data.url);
    } catch (err) {
      console.error('[ERROR] 소셜 로그인 실패:', err);
      setLoading(false);
    }
  };

  const handleShouldStartLoad = (request: { url: string }) => {
    const url = request.url;

    // access_token이 붙어있거나 redirectTo로 이동하려 하면 로그인 성공
    if (url.includes('access_token=') || (redirectUrl && url.startsWith(redirectUrl))) {
      setAuthUrl(null); // WebView 닫기

      const { access_token, refresh_token } = extractParamsFromUrl(url);

      if (!access_token || !refresh_token) {
        console.warn('[DEBUG] 토큰을 찾지 못함. url:', url);
        setLoading(false);
        return false;
      }

      supabase.auth.setSession({ access_token, refresh_token }).then(({ error: sessionError }) => {
        setLoading(false);

        if (sessionError) {
          console.error('[ERROR] setSession 실패:', sessionError);
          return;
        }

        // TODO: 닉네임 정하기 화면 디자인이 완성되면 신규 가입자는 그쪽으로 보내기
        router.replace('/(tabs)');
      });

      return false; // 실제로 로딩하지 않음 (ERR_CONNECTION_REFUSED 방지)
    }

    return true;
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/figma/logo-login.svg')}
        style={[styles.logo, { top: y(314) }]}
        contentFit="contain"
      />

      <View style={[styles.actions, { top: y(599) }]}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loading} />
        ) : (
          <>
            <Pressable
              style={({ pressed }) => [styles.button, styles.kakao, pressed && styles.pressed]}
              onPress={() => handleSocialLogin('kakao')}
            >
              <Text style={styles.buttonText}>카카오로 시작하기</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.button, styles.google, pressed && styles.pressed]}
              onPress={() => handleSocialLogin('google')}
            >
              <Text style={styles.buttonText}>구글로 시작하기</Text>
            </Pressable>
          </>
        )}
        <Text style={styles.privacy}>개인정보처리방침</Text>
      </View>

      <Modal visible={!!authUrl} animationType="slide">
        <SafeAreaView style={styles.webviewContainer}>
          {authUrl && (
            <WebView
              source={{ uri: authUrl }}
              onShouldStartLoadWithRequest={handleShouldStartLoad}
              // 카카오/구글 로그인 쿠키를 기기에 남기지 않는다 (로그아웃·탈퇴 후 자동 로그인 방지)
              incognito
              style={{ flex: 1 }}
            />
          )}
          <Pressable
            style={styles.close}
            onPress={() => {
              setAuthUrl(null);
              setLoading(false);
            }}
          >
            <Text style={styles.closeText}>닫기</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center' },
  logo: { position: 'absolute', width: 265, height: 72 },
  actions: { position: 'absolute', left: 25, right: 25, alignItems: 'center' },
  loading: { height: 131 },
  button: {
    width: '100%',
    height: 55,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kakao: { backgroundColor: Colors.kakao, marginBottom: 21 },
  google: { backgroundColor: Colors.white },
  pressed: { opacity: 0.8 },
  buttonText: { fontFamily: Fonts.semiBold, fontSize: 18, lineHeight: 18, color: Colors.black },
  privacy: {
    marginTop: 21,
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 19.6,
    letterSpacing: 0.28,
    color: Colors.textMuted,
    textDecorationLine: 'underline',
  },
  webviewContainer: { flex: 1, backgroundColor: Colors.white },
  close: { padding: 16, alignItems: 'center' },
  closeText: { fontFamily: Fonts.medium, fontSize: 16, color: Colors.black },
});
