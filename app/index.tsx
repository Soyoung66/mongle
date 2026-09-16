// app/(tabs)/index.tsx (탭 메인 화면 또는 마이페이지 예시)
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [nickname, setNickname] = useState<string>('로딩 중...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // profiles 테이블 조회 (insert는 절대 하지 않음)
      const { data, error } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // 닉네임이 없거나(null) 비어있을 경우 기본 이름으로 대체
      const userNickname = data?.nickname ? data.nickname : '몽글이 (기본이름)';
      setNickname(userNickname);
    } catch (err: any) {
      console.error('프로필 조회 에러:', err.message);
      setNickname('몽글이 (기본이름)'); // 에러 시에도 빈칸 방지
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
      return;
    }
    router.replace('/(auth)/login' as any);
  };

  // 회원 탈퇴 (DB에 정의된 delete_my_account RPC 호출 전 확인 창 띄움)
  const handleDeleteAccount = () => {
    Alert.alert(
      '회원 탈퇴',
      '정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '탈퇴', 
          style: 'destructive', 
          onPress: async () => {
            try {
              // 백엔드가 구성해 둔 RPC 함수 호출
              const { error } = await supabase.rpc('delete_my_account');
              if (error) throw error;

              // 탈퇴 성공 후 로그아웃 처리 및 로그인 화면으로 이동
              await supabase.auth.signOut();
              router.replace('/(auth)/login' as any);
            } catch (err: any) {
              Alert.alert('탈퇴 실패', err.message || '회원 탈퇴 처리 중 오류가 발생했습니다.');
            }
          } 
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#333" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>환영합니다!</Text>
      <Text style={styles.nickname}>닉네임: {nickname}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Text style={styles.buttonText}>로그아웃</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Text style={[styles.buttonText, { color: '#ff3b30' }]}>회원 탈퇴</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  nickname: { fontSize: 18, color: '#555', marginBottom: 30 },
  logoutButton: { width: '100%', height: 45, backgroundColor: '#f0f0f0', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  deleteButton: { width: '100%', height: 45, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ff3b30', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  buttonText: { fontSize: 15, fontWeight: '600' },
});