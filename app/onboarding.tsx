// app/onboarding.tsx — 온보딩 1~3 (Figma: 온보딩1 211:889, 온보딩2 211:1187, 온보딩3 211:898)
import { Image, type ImageSource } from 'expo-image';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TransformsStyle,
  View,
} from 'react-native';

import { useDesignFrame } from '@/components/useDesignFrame';
import { Colors, Fonts } from '@/constants/theme';

type Page = {
  title: string;
  // [텍스트, 강조 여부] 조각
  highlight: [string, boolean][];
  image: ImageSource;
  // 피그마 기준 이미지 바운딩 박스(중심 x, top, 크기)와 실제 이미지 크기
  box: { centerX: number; top: number; width: number; height: number };
  size: { width: number; height: number };
  transform?: TransformsStyle['transform'];
};

const PAGES: Page[] = [
  {
    title: '자기 전에',
    highlight: [['오늘 생각', true], ['을 짧게 적어요', false]],
    image: require('../assets/images/figma/onboarding1.png'),
    box: { centerX: 207.5, top: 339, width: 339, height: 283 },
    size: { width: 339, height: 283 },
  },
  {
    title: '그 문장이',
    highlight: [['나만의 몽글이', true], ['로 탄생해요', false]],
    image: require('../assets/images/figma/onboarding2.png'),
    box: { centerX: 212.22, top: 318, width: 376.441, height: 324.641 },
    size: { width: 348.451, height: 290.376 },
    transform: [{ rotate: '-174.1deg' }, { scaleY: -1 }],
  },
  {
    title: '만지고 나면',
    highlight: [['보관', true], ['하거나 ', false], ['놓아', true], ['줘요', false]],
    image: require('../assets/images/figma/onboarding3.png'),
    box: { centerX: 200.5, top: 349, width: 367, height: 245 },
    size: { width: 367, height: 245 },
    transform: [{ scaleX: -1 }],
  },
];

export default function OnboardingScreen() {
  const { width, height, x, y, s } = useDesignFrame();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const isLast = index === PAGES.length - 1;

  const goTo = (next: number) => {
    scrollRef.current?.scrollTo({ x: next * width, animated: true });
    setIndex(next);
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const handleNext = () => {
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {PAGES.map((page, i) => (
          <Pressable
            key={page.title}
            style={{ width, height }}
            // 피그마 프로토타입처럼 화면을 탭하면 다음 온보딩으로 이동
            onPress={i < PAGES.length - 1 ? () => goTo(i + 1) : undefined}
          >
            <View style={[styles.titleWrap, { top: y(199) }]}>
              <Text style={styles.title}>{page.title}</Text>
              <Text style={styles.title}>
                {page.highlight.map(([text, accent]) => (
                  <Text key={text} style={accent ? styles.accent : undefined}>
                    {text}
                  </Text>
                ))}
              </Text>
            </View>
            <View
              style={[
                styles.imageBox,
                {
                  left: x(page.box.centerX) - s(page.box.width) / 2,
                  top: y(page.box.top),
                  width: s(page.box.width),
                  height: s(page.box.height),
                },
              ]}
            >
              <Image
                source={page.image}
                style={{ width: s(page.size.width), height: s(page.size.height), transform: page.transform }}
                contentFit="cover"
              />
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={[styles.dots, { top: y(658) }]} pointerEvents="none">
        {PAGES.map((page, i) =>
          i === index ? (
            <View key={page.title} style={styles.dotActive} />
          ) : (
            <Image key={page.title} source={require('../assets/images/figma/dot-inactive.svg')} style={styles.dot} />
          ),
        )}
      </View>

      {isLast && (
        <Pressable
          style={({ pressed }) => [styles.button, { top: y(744), opacity: pressed ? 0.8 : 1 }]}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>다음</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  titleWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 24,
    lineHeight: 40.8,
    color: Colors.white,
    textAlign: 'center',
  },
  accent: { color: Colors.primary },
  imageBox: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 10,
  },
  dot: { width: 8, height: 8 },
  dotActive: { width: 23, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  button: {
    position: 'absolute',
    left: 32,
    right: 32,
    height: 55,
    borderRadius: 15,
    borderWidth: 1.125,
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontFamily: Fonts.semiBold, fontSize: 18, lineHeight: 18, color: Colors.black },
});
