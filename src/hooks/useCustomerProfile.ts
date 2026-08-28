'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  AUTH_QUERY_KEYS,
  customerProfileQueryKeys,
} from '@/constants/queryKey';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { uploadProfileImage } from '@/lib/uploadProfileImage';
import {
  getCustomerProfileMe,
  upsertCustomerProfile,
} from '@/services/customerProfileApi';

import type { UpsertCustomerProfileRequest } from '@/types/customerProfile';

interface UseUpsertCustomerProfileOptions {
  successMessage: string;
  errorFallbackMessage: string;
}

interface UpsertCustomerProfileVariables {
  body: UpsertCustomerProfileRequest;
  imageFile?: File | null;
}

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

/**
 * 프로필 이미지 업로드(있으면) 후 PATCH.
 * 성공 시 프로필·/me 캐시 무효화와 토스트를 처리한다.
 */
export const useUpsertCustomerProfile = ({
  successMessage,
  errorFallbackMessage,
}: UseUpsertCustomerProfileOptions) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async ({ body, imageFile }: UpsertCustomerProfileVariables) => {
      if (imageFile) {
        const s3Key = await uploadProfileImage(imageFile);
        return upsertCustomerProfile({ ...body, s3Key });
      }

      return upsertCustomerProfile(body);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: customerProfileQueryKeys.all,
        }),
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me() }),
      ]);
      showToast({ content: successMessage });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : errorFallbackMessage;
      showToast({ content: message });
    },
  });
};
