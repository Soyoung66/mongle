import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function LoginScreen() {
  const handleLogin = (provider: 'kakao' | 'google') => {
    // 나중에 Supabase 실제 로그인 로직이 들어갈 자리
    console.log(`${provider} 로그인 시도`);
    router.replace('/(tabs)'); // 임시로 홈 화면으로 이동
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>몽글 (mongle)</Text>
      <Text style={styles.subtitle}>간편하게 로그인하고 시작하세요</Text>

      {/* 카카오 로그인 버튼 스타일 예시 */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#FEE500' }]} 
        onPress={() => handleLogin('kakao')}
      >
        <Text style={[styles.buttonText, { color: '#000000' }]}>카카오로 시작하기</Text>
      </TouchableOpacity>

      {/* 구글 로그인 버튼 스타일 예시 */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DDDDDD' }]} 
        onPress={() => handleLogin('google')}
      >
        <Text style={[styles.buttonText, { color: '#333333' }]}>구글로 시작하기</Text>
      </TouchableOpacity>
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