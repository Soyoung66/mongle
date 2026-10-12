// app/archive/delete.tsx — 삭제 알림 (Figma: 삭제 알림 211:1161)
import { router } from 'expo-router';

import ConfirmDialog from '@/components/ConfirmDialog';

export default function DeleteMongleScreen() {
  const handleRelease = () => {
    // TODO: 보관한 몽글이 데이터가 생기면 여기서 해당 날짜의 몽글이 삭제
    router.dismissTo('/(tabs)/archive');
  };

  return (
    <ConfirmDialog
      title={'이 몽글이를\n정말 놓아줄까요?'}
      description="놓아준 몽글이는 다시 되돌릴 수 없어요"
      cancelLabel="돌아가기"
      confirmLabel="놓아주기"
      onCancel={() => router.back()}
      onConfirm={handleRelease}
    />
  );
}
