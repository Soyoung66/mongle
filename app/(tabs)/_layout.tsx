import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Fonts } from '@/constants/theme';

export const unstable_settings = {
  initialRouteName: 'index',
};

// 피그마 홈(211:952) 하단 탭: 보관함 / 홈 / 설정
const TAB_ITEMS = {
  archive: { label: '보관함', icon: require('../../assets/images/figma/icon-inbox.svg'), size: { width: 24, height: 20 } },
  index: { label: '홈', icon: require('../../assets/images/figma/icon-home.svg'), size: { width: 25, height: 25 } },
  settings: { label: '설정', icon: require('../../assets/images/figma/icon-settings.svg'), size: { width: 25, height: 25 } },
} as const;

type TabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

function MongleTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom + 19 }]}>
      {state.routes.map((route, i) => {
        const item = TAB_ITEMS[route.name as keyof typeof TAB_ITEMS];
        if (!item) return null;
        const focused = state.index === i;
        const color = focused ? Colors.tabActive : Colors.tabInactive;

        return (
          <Pressable
            key={route.key}
            style={styles.tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
            }}
          >
            <View style={styles.iconWrap}>
              <Image source={item.icon} style={item.size} tintColor={color} contentFit="contain" />
            </View>
            <Text style={[styles.label, { color }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      backBehavior="initialRoute"
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: Colors.background } }}
      tabBar={(props) => <MongleTabBar {...props} />}
    >
      <Tabs.Screen name="archive" />
      <Tabs.Screen name="index" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 96,
    paddingTop: 12,
    backgroundColor: Colors.background,
  },
  tab: { alignItems: 'center', width: 40 },
  iconWrap: { height: 25, justifyContent: 'center', marginBottom: 11 },
  label: { fontFamily: Fonts.regular, fontSize: 14, lineHeight: 19.6, textAlign: 'center' },
});
