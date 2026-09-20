// src/lib/supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

console.log('[DEBUG] URL 앞 20자:', supabaseUrl?.slice(0, 20));
console.log('[DEBUG] KEY 길이:', supabaseAnonKey?.length);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경변수가 설정되지 않았습니다.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // 웹 전용 옵션이므로 앱에서는 false 고정
  },
});