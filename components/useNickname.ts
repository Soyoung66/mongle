import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';

// TODO: 닉네임 정하기 화면이 생기면 거기서 저장한 닉네임 사용
export function useNickname(fallback = '00') {
  const [nickname, setNickname] = useState(fallback);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      const meta = user?.user_metadata;
      const name = meta?.nickname ?? meta?.name ?? meta?.full_name;
      if (name) setNickname(name);
    });
  }, []);

  return nickname;
}
