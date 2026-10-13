// app/mongle-touch.tsx — 말랑이 만지기 (three.js + ammo.js, 개발 중 로컬 서버에서 로드)
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDesignFrame } from '@/components/useDesignFrame';
import { Colors, Fonts } from '@/constants/theme';

// TODO: 프로덕션에서는 assets/html/slime.html을 앱에 내장해서 로드하도록 교체
// fit=0.7: 컨테이너를 키운 만큼 비율을 낮춰서 보이는 슬라임 크기는 Ellipse2 그대로 유지
const SLIME_URL = 'http://172.21.48.109:8787/slime.html?fit=0.7';

type MongleChoice = { color: string; damping: number; mass: number };

function handleChoice(choice: MongleChoice) {
  // TODO: 선택한 색/점도/무게를 보관/다음 화면으로 전달
  Alert.alert(
    '말랑이 선택 완료',
    `색: ${choice.color}\n점도: ${choice.damping.toFixed(3)}\n무게: ${choice.mass.toFixed(1)}`,
    [{ text: '확인', onPress: () => router.back() }]
  );
}

function SlimeFrame({ onChoice }: { onChoice: (c: MongleChoice) => void }) {
  if (Platform.OS === 'web') {
    // react-native-webview는 web을 지원하지 않으므로 iframe으로 대체
    useEffect(() => {
      const onMessage = (e: MessageEvent) => {
        if (e.data && typeof e.data === 'object' && 'color' in e.data) onChoice(e.data as MongleChoice);
      };
      window.addEventListener('message', onMessage);
      return () => window.removeEventListener('message', onMessage);
    }, [onChoice]);

    return (
      <iframe
        src={SLIME_URL}
        style={{ flex: 1, width: '100%', height: '100%', border: 0, background: 'transparent' }}
      />
    );
  }

  const { WebView } = require('react-native-webview');
  return (
    <WebView
      source={{ uri: SLIME_URL }}
      style={styles.webview}
      scrollEnabled={false}
      bounces={false}
      onMessage={(e: { nativeEvent: { data: string } }) => {
        try {
          onChoice(JSON.parse(e.nativeEvent.data));
        } catch {
          // 무시: 선택 메시지 형식이 아닌 경우
        }
      }}
    />
  );
}

export default function MongleTouchScreen() {
  const insets = useSafeAreaInsets();
  const { s, x, y } = useDesignFrame();

  // Figma: 몽글이 만지기 > Ellipse 2 — x:52 y:253 w:300 h:300 (디자인 좌표계 402x874 기준)
  // 컨테이너는 1.4배로 키워서(중심은 그대로) 당기기/누르기로 변형돼도 안 잘리게 하고,
  // 전체를 15% 위로 올린다.
  const CONTAINER_SCALE = 1.4;
  const size = s(300) * CONTAINER_SCALE;
  const left = x(52) - (size - s(300)) / 2;
  const top = y(253) - (size - s(300)) / 2 - size * 0.15;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ position: 'absolute', left, top, width: size, height: size }}>
        <SlimeFrame onChoice={handleChoice} />
      </View>
      <Pressable
        style={[styles.close, { top: insets.top + s(56), right: s(16), padding: s(10) }]}
        onPress={() => router.back()}
      >
        <Text style={[styles.closeText, { fontSize: s(16) }]}>닫기</Text>
      </Pressable>

      {/* Figma: 몽글이 만지기 > Button — x:32 y:744 w:338 h:55 */}
      <Pressable
        style={[styles.next, { left: x(32), top: y(744), width: s(338), height: s(55), borderRadius: s(15) }]}
        onPress={() => router.push('/mongle-keep')}
      >
        <Text style={[styles.nextText, { fontSize: s(18) }]}>다음</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  webview: { flex: 1, backgroundColor: 'transparent' },
  close: { position: 'absolute' },
  closeText: { fontFamily: Fonts.medium, fontSize: 16, color: Colors.white },
  next: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: { fontFamily: Fonts.semiBold, color: Colors.black },
});
