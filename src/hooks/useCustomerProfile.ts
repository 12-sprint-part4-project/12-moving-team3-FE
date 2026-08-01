'use client';

import { useQuery } from '@tanstack/react-query';

import { ApiError } from '@/lib/apiClient';
import { getCustomerProfile } from '@/services/customerProfileApi';
import type { CustomerProfileMe } from '@/types/customerProfile';

export const customerProfileQueryKeys = {
  all: ['customer-profile'] as const,
  me: () => [...customerProfileQueryKeys.all, 'me'] as const,
};

/** 404(미등록)는 null */
export const useCustomerProfile = (enabled = true) => {
  return useQuery({
    queryKey: customerProfileQueryKeys.me(),
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
    enabled,
  });
};
