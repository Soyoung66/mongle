import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>존재하지 않는 화면이에요.</Text>
      <Link href="/" style={styles.link}>
        처음으로 돌아가기
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: Colors.background },
  title: { fontFamily: Fonts.semiBold, fontSize: 20, color: Colors.white },
  link: { marginTop: 15, paddingVertical: 15, fontFamily: Fonts.regular, fontSize: 14, color: Colors.primary },
});
