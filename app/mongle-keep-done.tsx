// app/mongle-keep-done.tsx — 보관 완료 (Figma: 1차 회의 > low wireframe > 보관 완료 211:1054)
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDesignFrame } from '@/components/useDesignFrame';
import { Colors, Fonts } from '@/constants/theme';

export default function MongleKeepDoneScreen() {
  const { s, x, y } = useDesignFrame();

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.card, { left: x(30), top: y(341), width: s(336), height: s(213), borderRadius: s(20) }]}>
        <Text style={[styles.title, { fontSize: s(24), lineHeight: s(34) }]}>오늘의 몽글이를{'\n'}보관했어요!</Text>
        <Text style={[styles.subtitle, { fontSize: s(14), marginTop: s(16) }]}>이제 캘린더에서 또 볼 수 있어요</Text>
      </View>

      <Pressable
        style={[styles.button, { left: x(129), top: y(744), width: s(144), height: s(56), borderRadius: s(15) }]}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={[styles.buttonText, { fontSize: s(18) }]}>확인</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  card: {
    position: 'absolute',
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: { fontFamily: Fonts.semiBold, color: Colors.white, textAlign: 'center' },
  subtitle: { fontFamily: Fonts.regular, color: Colors.textMuted, textAlign: 'center' },
  button: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontFamily: Fonts.semiBold, color: Colors.black },
});
