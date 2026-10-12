import { useWindowDimensions } from 'react-native';

import { DESIGN_HEIGHT, DESIGN_WIDTH } from '@/constants/theme';

// 피그마 좌표(402 x 874)를 현재 화면 크기에 맞게 변환
export function useDesignFrame() {
  const { width, height } = useWindowDimensions();
  const sx = width / DESIGN_WIDTH;
  const sy = height / DESIGN_HEIGHT;

  return {
    width,
    height,
    // 가로 위치/크기
    x: (n: number) => n * sx,
    // 세로 위치
    y: (n: number) => n * sy,
    // 이미지처럼 비율을 유지해야 하는 크기
    s: (n: number) => n * Math.min(sx, sy),
  };
}
