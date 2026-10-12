// app/(tabs)/settings.tsx — 설정 (Figma: 설정 211:967)
import Constants from 'expo-constants';
import { Image, type ImageSource } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useDesignFrame } from '@/components/useDesignFrame';
import { useNickname } from '@/components/useNickname';
import { Colors, Fonts } from '@/constants/theme';
import { logout } from '@/lib/auth';

const icons = {
  volume: require('../../assets/images/figma/icon-volume.svg'),
  bell: require('../../assets/images/figma/icon-bell.svg'),
  info: require('../../assets/images/figma/icon-info.svg'),
  user: require('../../assets/images/figma/icon-user.svg'),
  userDanger: require('../../assets/images/figma/icon-user-danger.svg'),
  chevron: require('../../assets/images/figma/icon-chevron-small.svg'),
  edit: require('../../assets/images/figma/icon-edit.svg'),
  toggleOn: require('../../assets/images/figma/toggle-on.svg'),
  toggleOff: require('../../assets/images/figma/toggle-off.svg'),
};

type RowIcon = { source: ImageSource; box: number; width: number; height: number };

function RowLabel({ icon, label, color = Colors.white }: { icon: RowIcon; label: string; color?: string }) {
  return (
    <View style={styles.rowLabel}>
      <View style={[styles.iconBox, { width: icon.box, height: icon.box }]}>
        <Image source={icon.source} style={{ width: icon.width, height: icon.height }} contentFit="contain" />
      </View>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

function ToggleRow({ icon, label }: { icon: RowIcon; label: string }) {
  const [on, setOn] = useState(label === '사운드');

  return (
    <Pressable style={styles.row} onPress={() => setOn((v) => !v)} accessibilityRole="switch" accessibilityState={{ checked: on }}>
      <RowLabel icon={icon} label={label} />
      <Image
        source={on ? icons.toggleOn : icons.toggleOff}
        // 피그마 렌더에서 켜진 토글은 노브가 오른쪽에 있다
        style={[styles.toggle, on && { transform: [{ scaleX: -1 }] }]}
        contentFit="contain"
      />
    </Pressable>
  );
}

function LinkRow({ icon, label, color, onPress }: { icon: RowIcon; label: string; color?: string; onPress?: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && styles.pressed]} onPress={onPress}>
      <RowLabel icon={icon} label={label} color={color} />
      <View style={styles.chevronBox}>
        <Image source={icons.chevron} style={styles.chevron} contentFit="contain" />
      </View>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { y } = useDesignFrame();
  const nickname = useNickname('000');
  const version = Constants.expoConfig?.version ?? '0.0.0';

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/figma/logo-home.svg')}
        style={[styles.logo, { top: y(76) }]}
        contentFit="contain"
      />

      <View style={[styles.profile, { top: y(133) }]}>
        <Text style={styles.name}>{nickname} 님</Text>
        {/* TODO: 닉네임 편집 화면 디자인이 나오면 연결 */}
        <View style={styles.editPill}>
          <Text style={styles.editText}>편집</Text>
          <Image source={icons.edit} style={styles.editIcon} contentFit="contain" />
        </View>
      </View>

      <View style={[styles.list, { top: y(235) }]}>
        <ToggleRow icon={{ source: icons.volume, box: 24, width: 22, height: 16.14 }} label="사운드" />
        <ToggleRow icon={{ source: icons.bell, box: 20, width: 17, height: 18.66 }} label="알림" />
        {/* TODO: 개인정보 처리 방침 페이지가 정해지면 연결 */}
        <LinkRow icon={{ source: icons.info, box: 20, width: 18.67, height: 18.67 }} label="개인정보 처리 방침" />
        <LinkRow icon={{ source: icons.user, box: 24, width: 18.5, height: 20.5 }} label="로그아웃" onPress={logout} />
        <LinkRow
          icon={{ source: icons.userDanger, box: 24, width: 18.5, height: 20.5 }}
          label="회원탈퇴"
          color={Colors.danger}
          onPress={() => router.push('/withdraw')}
        />
      </View>

      <Text style={[styles.version, { top: y(685) }]}>버전 {version}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  logo: { position: 'absolute', left: 33, width: 82, height: 22 },
  profile: {
    position: 'absolute',
    left: 33,
    right: 23,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: { fontFamily: Fonts.semiBold, fontSize: 24, lineHeight: 40, color: Colors.white },
  editPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 28,
    paddingLeft: 10,
    paddingRight: 8,
    borderRadius: 14,
    borderWidth: 0.903,
    borderColor: Colors.textMuted,
  },
  editText: { fontFamily: Fonts.medium, fontSize: 13.05, lineHeight: 15.4, color: Colors.textMuted },
  editIcon: { width: 13.38, height: 13.38 },
  list: { position: 'absolute', left: 29, right: 32, gap: 30 },
  row: { height: 27, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pressed: { opacity: 0.6 },
  rowLabel: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { alignItems: 'center', justifyContent: 'center', marginRight: 29 },
  label: { fontFamily: Fonts.medium, fontSize: 16, lineHeight: 28 },
  toggle: { width: 42, height: 22 },
  chevronBox: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  chevron: { width: 7, height: 11.5, transform: [{ scaleX: -1 }] },
  version: {
    position: 'absolute',
    left: 0,
    right: 0,
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 14,
    color: Colors.textSubtle,
    textAlign: 'center',
  },
});
