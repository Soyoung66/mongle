// app/withdraw.tsx — 회원 탈퇴 확인 (Figma: 회원 탈퇴 확인 211:1013)
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import ConfirmDialog from '@/components/ConfirmDialog';
import { Colors } from '@/constants/theme';
import { withdraw } from '@/lib/auth';

export default function WithdrawScreen() {
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      await withdraw();
    } catch (err) {
      console.error('[ERROR] 회원탈퇴 실패:', err);
      setLoading(false);
      Alert.alert('회원탈퇴 실패', '잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <ConfirmDialog
      title={'정말 몽글을\n떠나시겠어요?'}
      description={'회원탈퇴 시 지금까지 만든 몽글과\n모든 기록이 삭제되며, 다시 복구할 수 없어요'}
      descriptionColor={Colors.danger}
      cancelLabel="취소"
      confirmLabel="회원탈퇴"
      onCancel={() => router.back()}
      onConfirm={handleWithdraw}
      loading={loading}
    />
  );
}
