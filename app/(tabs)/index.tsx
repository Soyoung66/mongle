import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [deleting, setDeleting] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[ERROR] 로그아웃 실패:', error);
      return;
    }
    router.replace('/(auth)/login' as any);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '회원탈퇴',
      '정말 탈퇴하시겠어요? 모든 데이터가 삭제되며 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '탈퇴하기',
          style: 'destructive',
          onPress: confirmDeleteAccount,
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    try {
      setDeleting(true);

      // Supabase RPC 함수 호출 (민상 님이 만들어둔 delete_my_account)
      const { error } = await supabase.rpc('delete_my_account');

      if (error) {
        console.error('[ERROR] 회원탈퇴 실패:', error);
        Alert.alert('오류', '탈퇴 처리 중 문제가 발생했습니다. 다시 시도해주세요.');
        return;
      }

      // 탈퇴 성공 후 로컬 세션도 정리
      await supabase.auth.signOut();
      router.replace('/(auth)/login' as any);
    } catch (err) {
      console.error('[ERROR] 예외 발생:', err);
      Alert.alert('오류', '알 수 없는 오류가 발생했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>몽글에 오신 걸 환영해요 🎉</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>

      {deleting ? (
        <ActivityIndicator size="small" color="#999" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteText}>회원탈퇴</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 30,
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  logoutText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  deleteText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '500',
  },
});