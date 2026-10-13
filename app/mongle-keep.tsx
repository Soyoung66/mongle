// app/mongle-keep.tsx — 보관과 놓아주기 선택 (Figma: 1차 회의 > low wireframe > 보관과 놓아주기 선택 211:1047)
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDesignFrame } from '@/components/useDesignFrame';
import { Colors, Fonts } from '@/constants/theme';

export default function MongleKeepScreen() {
  const { s, x, y } = useDesignFrame();

  const keep = () => router.replace('/mongle-keep-done');
  const release = () => router.replace('/(tabs)');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, { top: y(149), fontSize: s(24), lineHeight: s(41) }]}>
        오늘의 몽글이를{'\n'}
        <Text style={styles.accent}>보관</Text>할까요?
      </Text>

      {/* Figma: Ellipse 2 — x:144 y:360 w:114 h:114 */}
      <View
        style={{
          position: 'absolute',
          left: x(144),
          top: y(360),
          width: s(114),
          height: s(114),
          borderRadius: s(57),
          backgroundColor: Colors.surfaceRaised,
        }}
      />

      <Pressable
        style={[styles.button, styles.keepBtn, { left: x(52), top: y(559), width: s(138), height: s(62), borderRadius: s(15) }]}
        onPress={keep}
      >
        <Text style={[styles.btnText, { fontSize: s(18), color: Colors.black }]}>보관하기</Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.releaseBtn, { left: x(204), top: y(559), width: s(138), height: s(62), borderRadius: s(15) }]}
        onPress={release}
      >
        <Text style={[styles.btnText, { fontSize: s(18), color: Colors.white }]}>놓아주기</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
    textAlign: 'center',
  },
  accent: { color: Colors.primary },
  button: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  keepBtn: { backgroundColor: Colors.primary },
  releaseBtn: { backgroundColor: Colors.surfaceRaised },
  btnText: { fontFamily: Fonts.semiBold },
});
