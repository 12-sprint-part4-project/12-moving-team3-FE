'use client';

import { useQuery } from '@tanstack/react-query';

import { customerProfileQueryKeys } from '@/constants/queryKey';
import { useAuth } from '@/hooks/useAuth';
import { getCustomerProfileMe } from '@/services/customerProfileApi';

/** 본인 프로필 조회. 미등록(404)은 null */
export const useCustomerProfile = (enabled = true) => {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: customerProfileQueryKeys.me(userId ?? 'anonymous'),
    queryFn: getCustomerProfileMe,
    enabled: enabled && Boolean(userId),
  });
};
