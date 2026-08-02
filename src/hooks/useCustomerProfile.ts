'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/lib/apiClient';
import { getCustomerProfile } from '@/services/customerProfileApi';
import type { CustomerProfileMe } from '@/types/customerProfile';

export const customerProfileQueryKeys = {
  all: ['customer-profile'] as const,
  me: (userId: string) =>
    [...customerProfileQueryKeys.all, 'me', userId] as const,
};

/** 404(미등록)는 null. queryKey에 userId를 넣어 계정 전환 시 캐시 혼선을 막는다. */
export const useCustomerProfile = (enabled = true) => {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: customerProfileQueryKeys.me(userId ?? 'anonymous'),
    queryFn: async (): Promise<CustomerProfileMe | null> => {
      try {
        const response = await getCustomerProfile();
        return response.data;
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: enabled && Boolean(userId),
  });
};
