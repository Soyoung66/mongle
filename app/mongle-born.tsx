// app/mongle-born.tsx — 몽글이 탄생 (Figma: 1차 회의 > low wireframe > 몽글이 탄생 211:1169)
// Ellipse 2 자리에 실제 말랑이 만지기와 같은 슬라임(three.js/ammo.js)을 비인터랙티브로 띄운다.
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { useDesignFrame } from '@/components/useDesignFrame';
import { Colors, Fonts } from '@/constants/theme';
import { slimeUrl } from '@/lib/slime';

const SLIME_URL = slimeUrl(0.6);

const SHOW_MS = 2000;

function SlimePreview() {
  if (Platform.OS === 'web') {
    return (
      <iframe
        src={SLIME_URL}
        style={{ width: '100%', height: '100%', border: 0, background: 'transparent', pointerEvents: 'none' }}
      />
    );
  }
  const { WebView } = require('react-native-webview');
  return (
    <WebView
      source={{ uri: SLIME_URL }}
      style={styles.fill}
      pointerEvents="none"
      scrollEnabled={false}
      bounces={false}
    />
  );
}

export default function MongleBornScreen() {
  const { s, x, y } = useDesignFrame();
  useLocalSearchParams<{ emotion?: string }>();

  useEffect(() => {
    const timeout = setTimeout(() => router.replace('/mongle-touch'), SHOW_MS);
    return () => clearTimeout(timeout);
  }, []);

  // Figma: Ellipse 2 — x:108 y:273 w:185 h:185 (디자인 좌표계 402x874 기준)
  // 보이는 슬라임 크기를 Ellipse2보다 작게 줄임 (컨테이너는 살짝만 여유를 둠)
  const previewSize = s(185) * 1.1;
  const previewLeft = x(108 + 185 / 2) - previewSize / 2;
  const previewTop = y(273 + 185 / 2) - previewSize / 2;

  return (
    <View style={styles.container}>
      <View style={{ position: 'absolute', left: previewLeft, top: previewTop, width: previewSize, height: previewSize }}>
        <SlimePreview />
      </View>
      <Text style={[styles.title, { top: y(521), fontSize: s(22), lineHeight: s(30) }]}>
        오늘의 몽글이가{'\n'}완성되었어요!
      </Text>
      <Text style={[styles.subtitle, { top: y(608), fontSize: s(14) }]}>이제 몽글이를 만지면서 생각 정리를 해볼까요?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  fill: { flex: 1, backgroundColor: 'transparent' },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
    textAlign: 'center',
  },
  subtitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
