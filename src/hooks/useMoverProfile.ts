'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { AUTH_QUERY_KEYS, moverProfileQueryKeys } from '@/constants/queryKey';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { uploadProfileImage } from '@/lib/uploadProfileImage';
import {
  getMoverProfileMe,
  updateMoverBasicInfo,
  upsertMoverProfile,
} from '@/services/moverProfileApi';

import type {
  UpdateMoverBasicInfoRequest,
  UpsertMoverProfileRequest,
} from '@/types/moverProfile';

interface UseMoverProfileMutationOptions {
  successMessage: string;
  errorFallbackMessage: string;
}

interface UpsertMoverProfileVariables {
  body: UpsertMoverProfileRequest;
  imageFile?: File | null;
}

interface CreateMoverProfileVariables {
  body: Omit<UpsertMoverProfileRequest, 's3Key'>;
  imageFile?: File | null;
  phoneDigits: string;
}

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

/**
 * 프로필 이미지 업로드(있으면) 후 PATCH.
 * 성공 시 프로필·/me 캐시 무효화와 토스트를 처리한다.
 */
export const useUpsertMoverProfile = ({
  successMessage,
  errorFallbackMessage,
}: UseMoverProfileMutationOptions) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async ({ body, imageFile }: UpsertMoverProfileVariables) => {
      if (imageFile) {
        const s3Key = await uploadProfileImage(imageFile);
        return upsertMoverProfile({ ...body, s3Key });
      }

      return upsertMoverProfile(body);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: moverProfileQueryKeys.all,
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

/**
 * 기사님 프로필 등록.
 * 프로필 PATCH 후 전화번호를 basic-info에 저장한다.
 */
export const useCreateMoverProfile = ({
  successMessage,
  errorFallbackMessage,
}: UseMoverProfileMutationOptions) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async ({
      body,
      imageFile,
      phoneDigits,
    }: CreateMoverProfileVariables) => {
      let s3Key: string | undefined;

      if (imageFile) {
        s3Key = await uploadProfileImage(imageFile);
      }

      await upsertMoverProfile({
        ...body,
        ...(s3Key ? { s3Key } : {}),
      });

      const savedProfile = await getMoverProfileMe();
      if (savedProfile) {
        await updateMoverBasicInfo({
          name: savedProfile.name,
          phoneNumber: phoneDigits,
        });
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: moverProfileQueryKeys.all,
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

/** 기사님 기본정보 PATCH. 성공 시 프로필·/me 캐시 무효화와 토스트를 처리한다. */
export const useUpdateMoverBasicInfo = ({
  successMessage,
  errorFallbackMessage,
}: UseMoverProfileMutationOptions) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (body: UpdateMoverBasicInfoRequest) =>
      updateMoverBasicInfo(body),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: moverProfileQueryKeys.all,
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
