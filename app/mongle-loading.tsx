// app/mongle-loading.tsx — 몽글이가 만들어지는 중 로딩 모션
// Figma 프로토타입 설정: After Delay 500ms → Smart Animate 300ms.
// 껍데기(말랑이 껍데기 3)는 화면 정중앙 고정, 감정 캐릭터는 껍데기 위 레이어에서
// 이전 감정이 왼쪽으로 빠져나가고 다음 감정이 오른쪽에서 들어온다 (잘리지 않음).
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDesignFrame } from '@/components/useDesignFrame';
import { Colors, Fonts } from '@/constants/theme';

const FRAMES = [
  require('../assets/images/figma/loading/surprise.png'),
  require('../assets/images/figma/loading/angry.png'),
  require('../assets/images/figma/loading/happy.png'),
  require('../assets/images/figma/loading/sad.png'),
  require('../assets/images/figma/loading/fear.png'),
  require('../assets/images/figma/loading/disgust.png'),
];
const SHELL = require('../assets/images/figma/loading/shell.png');

const DELAY_MS = 500;
const TRANSITION_MS = 300;
const TOTAL_STEPS = FRAMES.length;

export default function MongleLoadingScreen() {
  const { s } = useDesignFrame();
  const bubbleSize = s(280);
  const emotionSize = s(150);
  const travel = s(200);

  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let count = 0;
    let idx = 0;

    const step = () => {
      count += 1;
      if (count >= TOTAL_STEPS) {
        router.replace({ pathname: '/mongle-born', params: { emotion: String(idx) } });
        return;
      }
      setPrev(idx);
      idx = (idx + 1) % FRAMES.length;
      setCurrent(idx);
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: TRANSITION_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    };

    const interval = setInterval(step, DELAY_MS);
    return () => clearInterval(interval);
  }, []);

  const outStyle = {
    opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
    transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, -travel] }) }],
  };
  const inStyle = {
    opacity: progress,
    transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [travel, 0] }) }],
  };
  const emotionBox = { position: 'absolute' as const, width: emotionSize, height: emotionSize };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <View style={{ width: bubbleSize, height: bubbleSize, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={SHELL} style={{ position: 'absolute', width: bubbleSize, height: bubbleSize }} contentFit="contain" />
          {prev !== null && (
            <Animated.View style={[emotionBox, outStyle]}>
              <Image source={FRAMES[prev]} style={styles.fill} contentFit="contain" />
            </Animated.View>
          )}
          <Animated.View style={[emotionBox, inStyle]}>
            <Image source={FRAMES[current]} style={styles.fill} contentFit="contain" />
          </Animated.View>
        </View>
        <Text style={[styles.label, { marginTop: s(24), fontSize: s(24), lineHeight: s(36) }]}>
          몽글이가{'\n'}만들어지는 중이에요
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fill: { width: '100%', height: '100%' },
  label: {
    fontFamily: Fonts.semiBold,
    color: Colors.white,
    textAlign: 'center',
  },
});
