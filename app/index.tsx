// app/index.tsx — 스플래시 (Figma: 스플래시 211:867)
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useDesignFrame } from '@/components/useDesignFrame';
import { Colors, DESIGN_HEIGHT, DESIGN_WIDTH, Fonts } from '@/constants/theme';

const SPLASH_DURATION = 2000;

const characters = require('../assets/images/figma/splash-characters.png');

// 하나의 캐릭터 이미지에서 잘라 쓰는 조각들 (피그마 image 3~9)
// box: 회전 전 바운딩 박스, size: 실제 이미지 박스, crop: 이미지의 위치/크기(%)
type Percent = `${number}%`;

type Piece = {
  box: { left: number; top: number; width: number; height: number };
  size?: { width: number; height: number };
  rotate?: string;
  crop: { left: Percent; top: Percent; width: Percent; height: Percent };
};

const PIECES: Piece[] = [
  // image 5 (초록)
  {
    box: { left: 137.72, top: 560, width: 127, height: 203 },
    crop: { left: '-20.93%', top: '-116.82%', width: '395.35%', height: '233.93%' },
  },
  // image 6 (빨강)
  {
    box: { left: 0, top: 591.73, width: 171.178, height: 186.845 },
    size: { width: 153.682, height: 171.347 },
    rotate: '-6.16deg',
    crop: { left: '-217.62%', top: '-34.72%', width: '325.67%', height: '277.34%' },
  },
  // image 3 (보라)
  {
    box: { left: 226.69, top: 567.4, width: 169.071, height: 230.965 },
    size: { width: 132.855, height: 210.207 },
    rotate: '10.54deg',
    crop: { left: '-135.11%', top: '-111.81%', width: '377.78%', height: '226.71%' },
  },
  // image 9 (주황)
  {
    box: { left: 226.69, top: 695.67, width: 209.27, height: 230.326 },
    size: { width: 163.871, height: 193.934 },
    rotate: '15.31deg',
    crop: { left: '-198.92%', top: '-129.8%', width: '305.76%', height: '245.31%' },
  },
  // image 4 (파랑)
  {
    box: { left: 10.72, top: 712, width: 149, height: 176 },
    crop: { left: '-10.24%', top: '-27.44%', width: '334.65%', height: '269.92%' },
  },
  // image 7 (노랑)
  {
    box: { left: 125.72, top: 710, width: 164, height: 179 },
    crop: { left: '-102.14%', top: '-26.33%', width: '303.57%', height: '265.48%' },
  },
];

export default function SplashScreen() {
  const { width, y } = useDesignFrame();
  // 하단 유리구슬 그룹은 화면 폭 기준으로 맞추고 바닥에 붙인다
  const k = width / DESIGN_WIDTH;
  const p = (n: number) => n * k;

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/onboarding'), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/figma/logo-splash.svg')}
        style={[styles.logo, { top: y(241), width: p(298), height: p(81) }]}
        contentFit="contain"
      />
      <Text style={[styles.tagline, { top: y(347) }]}>
        내 하루로 만드는 말랑이, <Text style={styles.accent}>몽글</Text>
      </Text>

      <View style={[styles.bubble, { width, height: p(DESIGN_HEIGHT) }]} pointerEvents="none">
        <Image
          source={require('../assets/images/figma/splash-ellipse-back.svg')}
          style={{ position: 'absolute', left: p(-56), top: p(499), width: p(514), height: p(500) }}
          contentFit="fill"
        />
        {PIECES.map((piece, i) => (
          <View
            key={i}
            style={[
              styles.pieceBox,
              {
                left: p(piece.box.left),
                top: p(piece.box.top),
                width: p(piece.box.width),
                height: p(piece.box.height),
              },
            ]}
          >
            <View
              style={{
                width: p(piece.size?.width ?? piece.box.width),
                height: p(piece.size?.height ?? piece.box.height),
                overflow: 'hidden',
                transform: piece.rotate ? [{ rotate: piece.rotate }] : undefined,
              }}
            >
              <Image
                source={characters}
                style={{ position: 'absolute', ...piece.crop }}
                contentFit="fill"
              />
            </View>
          </View>
        ))}
        <Image
          source={require('../assets/images/figma/splash-ellipse-front.svg')}
          style={{ position: 'absolute', left: p(-53), top: p(511), width: p(507), height: p(507) }}
          contentFit="fill"
        />
        <Image
          source={require('../assets/images/figma/splash-shell.png')}
          style={{ position: 'absolute', left: p(-92), top: p(420), width: p(544), height: p(580) }}
          contentFit="cover"
          blurRadius={5}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', overflow: 'hidden' },
  logo: { position: 'absolute' },
  tagline: {
    position: 'absolute',
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    lineHeight: 30,
    color: Colors.white,
    textAlign: 'center',
  },
  accent: { color: Colors.primary },
  bubble: { position: 'absolute', left: 0, bottom: 0 },
  pieceBox: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
});
