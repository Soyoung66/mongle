import Constants from 'expo-constants';
import { Platform } from 'react-native';

const SLIME_PORT = 8787;

// 개발 중에는 `npm run slime`으로 assets/html 을 띄운 컴퓨터에서 slime.html을 불러온다.
// 기본값은 Expo 개발 서버를 실행 중인 컴퓨터(= 같은 PC)의 주소이고,
// 다른 주소를 쓰려면 .env 에 EXPO_PUBLIC_SLIME_BASE_URL=http://<IP>:8787 을 넣는다.
// TODO: 프로덕션에서는 assets/html/slime.html을 앱에 내장해서 로드하도록 교체
function slimeBaseUrl() {
  if (process.env.EXPO_PUBLIC_SLIME_BASE_URL) return process.env.EXPO_PUBLIC_SLIME_BASE_URL;

  const host =
    Platform.OS === 'web'
      ? window.location.hostname
      : Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
  return `http://${host}:${SLIME_PORT}`;
}

export function slimeUrl(fit: number) {
  return `${slimeBaseUrl()}/slime.html?fit=${fit}`;
}
