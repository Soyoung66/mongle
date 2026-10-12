// app/(tabs)/archive.tsx — 보관함 캘린더 (Figma: 보관함 캘린더 211:1062)
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useDesignFrame } from '@/components/useDesignFrame';
import { Colors, Fonts } from '@/constants/theme';

const COLUMNS = 5;
const CELL_WIDTH = 34;
const CELL_HEIGHT = 32;
const COLUMN_GAP = 40;
const ROW_GAP = 100;

const chevron = require('../../assets/images/figma/icon-calendar-chevron.svg');

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function ArchiveScreen() {
  const { y } = useDesignFrame();
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const rows = Array.from({ length: Math.ceil(daysInMonth / COLUMNS) }, (_, r) =>
    days.slice(r * COLUMNS, r * COLUMNS + COLUMNS),
  );
  const isCurrentMonth = cursor.year === today.getFullYear() && cursor.month === today.getMonth();

  const moveMonth = (delta: number) => {
    setCursor(({ year, month }) => {
      const next = new Date(year, month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { top: y(72) }]}>
        <Pressable style={styles.chevronButton} onPress={() => moveMonth(-1)} hitSlop={12}>
          <Image source={chevron} style={styles.chevron} contentFit="contain" />
        </Pressable>
        <Text style={styles.title}>
          {cursor.year}년 {cursor.month + 1}월
        </Text>
        <Pressable style={styles.chevronButton} onPress={() => moveMonth(1)} hitSlop={12}>
          <Image source={chevron} style={[styles.chevron, { transform: [{ scaleX: -1 }] }]} contentFit="contain" />
        </Pressable>
      </View>

      <ScrollView
        style={[styles.calendar, { top: y(185) }]}
        contentContainerStyle={styles.calendarContent}
        showsVerticalScrollIndicator={false}
      >
        {rows.map((row, r) => (
          <View key={r} style={styles.week}>
            {row.map((day) => {
              const selected = isCurrentMonth && day === today.getDate();
              return (
                <Pressable
                  key={day}
                  style={styles.cell}
                  hitSlop={{ top: 20, bottom: 20, left: 16, right: 16 }}
                  onPress={() => router.push(`/archive/${toDateKey(cursor.year, cursor.month, day)}`)}
                >
                  {selected && (
                    <Image
                      source={require('../../assets/images/figma/calendar-selected.svg')}
                      style={styles.selected}
                    />
                  )}
                  <Text style={[styles.day, selected && styles.daySelected]}>{day}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 70,
  },
  chevronButton: { width: 24, height: 24 },
  chevron: { width: 24, height: 24 },
  title: { fontFamily: Fonts.semiBold, fontSize: 24, lineHeight: 42, color: Colors.white },
  calendar: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  calendarContent: { alignItems: 'center', paddingTop: 3, paddingBottom: 40, gap: ROW_GAP },
  week: {
    flexDirection: 'row',
    gap: COLUMN_GAP,
    width: COLUMNS * CELL_WIDTH + (COLUMNS - 1) * COLUMN_GAP,
  },
  cell: { width: CELL_WIDTH, height: CELL_HEIGHT, alignItems: 'center', justifyContent: 'center' },
  selected: { position: 'absolute', width: 38, height: 38 },
  day: { fontFamily: Fonts.medium, fontSize: 20, lineHeight: 30, color: Colors.white, textAlign: 'center' },
  daySelected: { fontFamily: Fonts.semiBold, color: Colors.black },
});
