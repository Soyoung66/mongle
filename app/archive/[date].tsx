// app/archive/[date].tsx — 보관한 몽글이 보기 (Figma: 보관한 몽글이 보기 211:1132)
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useDesignFrame } from '@/components/useDesignFrame';
import { Colors, Fonts } from '@/constants/theme';

export default function ArchiveDetailScreen() {
  const { y } = useDesignFrame();
  const { date } = useLocalSearchParams<{ date: string }>();
  const [, month, day] = (date ?? '').split('-').map(Number);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { top: y(72) }]}>
        <Pressable style={styles.side} onPress={() => router.back()} hitSlop={12}>
          <View style={styles.backBox}>
            <Image source={require('../../assets/images/figma/icon-back.svg')} style={styles.back} contentFit="contain" />
          </View>
        </Pressable>
        <Text style={styles.title}>
          {month}월 {day}일
        </Text>
        <Pressable
          style={[styles.side, styles.sideRight]}
          onPress={() => router.push({ pathname: '/archive/delete', params: { date } })}
          hitSlop={12}
        >
          <Text style={styles.delete}>삭제</Text>
        </Pressable>
      </View>

      {/* TODO: 보관한 몽글이 데이터가 생기면 실제 몽글이 이미지로 교체 */}
      <Image
        source={require('../../assets/images/figma/mongle-placeholder.svg')}
        style={[styles.mongle, { top: y(293) }]}
        contentFit="contain"
      />

      <View style={[styles.textBox, { top: y(632) }]}>
        <Text style={styles.placeholder}>그날 썼던 내용</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center' },
  header: {
    position: 'absolute',
    left: 34,
    right: 32,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  side: { width: 40 },
  sideRight: { alignItems: 'flex-end' },
  backBox: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  back: { width: 8.5, height: 14.5 },
  title: { fontFamily: Fonts.semiBold, fontSize: 20, lineHeight: 20, color: Colors.primary },
  delete: { fontFamily: Fonts.medium, fontSize: 16, lineHeight: 16, color: Colors.danger },
  mongle: { position: 'absolute', width: 185, height: 185 },
  textBox: {
    position: 'absolute',
    left: 33,
    right: 34,
    height: 190,
    borderRadius: 9.05,
    backgroundColor: Colors.surfaceRaised,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  placeholder: { fontFamily: Fonts.regular, fontSize: 16, lineHeight: 16, color: Colors.textMuted },
});
