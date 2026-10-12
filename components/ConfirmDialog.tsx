import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';

// 피그마 "회원 탈퇴 확인"(211:1013), "삭제 알림"(211:1161) 공통 레이아웃
type Props = {
  title: string;
  description: string;
  descriptionColor?: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export default function ConfirmDialog({
  title,
  description,
  descriptionColor = Colors.white,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  loading = false,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.description, { color: descriptionColor }]}>{description}</Text>
        <View style={styles.buttons}>
          <Pressable
            style={({ pressed }) => [styles.button, styles.cancel, pressed && styles.pressed]}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={[styles.buttonText, { color: Colors.black }]}>{cancelLabel}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.button, styles.confirm, pressed && styles.pressed]}
            onPress={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={[styles.buttonText, { color: Colors.white }]}>{confirmLabel}</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', paddingHorizontal: 33 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 15,
    paddingTop: 30,
    paddingBottom: 22,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  title: { fontFamily: Fonts.semiBold, fontSize: 20, lineHeight: 30, color: Colors.white, textAlign: 'center' },
  description: { marginTop: 12, fontFamily: Fonts.regular, fontSize: 13, lineHeight: 19.5, textAlign: 'center' },
  buttons: { flexDirection: 'row', gap: 13, marginTop: 22, alignSelf: 'stretch' },
  button: { flex: 1, height: 56, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  cancel: { backgroundColor: Colors.primary },
  confirm: { backgroundColor: Colors.surfaceRaised },
  pressed: { opacity: 0.8 },
  buttonText: { fontFamily: Fonts.semiBold, fontSize: 18, lineHeight: 18 },
});
