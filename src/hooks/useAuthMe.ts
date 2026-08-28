'use client';

import { useQuery } from '@tanstack/react-query';

import { AUTH_QUERY_KEYS } from '@/constants/queryKey';
import { getMe } from '@/services/authApi';

import type { AuthUser } from '@/types/auth';

const normalizeAuthUser = (user: AuthUser): AuthUser => {
  const status = user.status === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE';
  if (user.status === status) {
    return user;
  }
  return { ...user, status };
};

/** Access Token이 있을 때 현재 유저(me) 조회 */
export const useAuthMe = (enabled: boolean) => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me(),
    queryFn: async () => {
      const response = await getMe();
      return normalizeAuthUser(response.data.user);
    },
    enabled,
    retry: false,
  });
};
