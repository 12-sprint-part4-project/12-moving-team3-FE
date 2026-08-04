'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { getMoverProfileMe } from '@/services/moverProfileApi';

export const moverProfileQueryKeys = {
  all: ['mover-profile'] as const,
  me: (userId: string) => [...moverProfileQueryKeys.all, 'me', userId] as const,
};

/** 본인 프로필 조회. 미등록(404)은 null */
export const useMoverProfile = (enabled = true) => {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: moverProfileQueryKeys.me(userId ?? 'anonymous'),
    queryFn: getMoverProfileMe,
    enabled: enabled && Boolean(userId),
  });
};
