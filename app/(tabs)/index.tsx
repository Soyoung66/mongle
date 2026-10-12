// app/(tabs)/index.tsx — 홈 (Figma: 홈 211:952)
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { useDesignFrame } from '@/components/useDesignFrame';
import { useNickname } from '@/components/useNickname';
import { Colors, Fonts } from '@/constants/theme';

export default function HomeScreen() {
  const { y } = useDesignFrame();
  const nickname = useNickname();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/figma/logo-home.svg')}
        style={[styles.logo, { top: y(76) }]}
        contentFit="contain"
      />
      <View style={[styles.greeting, { top: y(148) }]}>
        <Text style={styles.greetingText}>
          <Text style={styles.accent}>{nickname}</Text>님, 오늘은
        </Text>
        <Text style={styles.greetingText}>어떤 하루를 보내셨나요?</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  logo: { position: 'absolute', left: 33, width: 82, height: 22 },
  greeting: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  greetingText: {
    fontFamily: Fonts.semiBold,
    fontSize: 24,
    lineHeight: 42,
    color: Colors.white,
    textAlign: 'center',
  },
  accent: { color: Colors.primary },
});
