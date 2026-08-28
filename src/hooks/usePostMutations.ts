'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { communityQueryKeys } from '@/constants/queryKey';
import {
  invalidatePostSummary,
  markPostCompletedInCache,
  removePostFromCache,
} from '@/lib/communityQueryHelpers';
import { uploadPostImage } from '@/lib/uploadPostImage';
import {
  completePost,
  createPost,
  deletePost,
  updatePost,
} from '@/services/communityApi';

import type {
  CreatePostBody,
  PostDetailResponse,
  UpdatePostBody,
} from '@/types/community';

/** 게시글 작성 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreatePostBody) => createPost(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: communityQueryKeys.lists(),
      });
    },
  });
};

/** 게시글 수정 */
export const useUpdatePost = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdatePostBody) => updatePost(postId, body),
    onSuccess: async () => {
      await invalidatePostSummary(queryClient, postId);
    },
  });
};

/** 게시글 삭제 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: async (_data, postId) => {
      removePostFromCache(queryClient, postId);
      await queryClient.invalidateQueries({
        queryKey: communityQueryKeys.lists(),
      });
    },
  });
};

/** 가구 나눔 게시글 나눔 완료 */
export const useCompletePost = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => completePost(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: communityQueryKeys.detail(postId),
      });
      await queryClient.cancelQueries({
        queryKey: communityQueryKeys.lists(),
      });

      const previousDetail = queryClient.getQueryData<PostDetailResponse>(
        communityQueryKeys.detail(postId)
      );

      markPostCompletedInCache(queryClient, postId);

      return { previousDetail };
    },
    onSuccess: async () => {
      await invalidatePostSummary(queryClient, postId);
    },
    onError: (_error, _variables, context) => {
      if (context?.previousDetail !== undefined) {
        queryClient.setQueryData(
          communityQueryKeys.detail(postId),
          context.previousDetail
        );
      }

      void queryClient.invalidateQueries({
        queryKey: communityQueryKeys.lists(),
      });
    },
  });
};

/** S3 이미지 업로드 */
export const useUploadPostImage = () =>
  useMutation({
    mutationFn: (file: File) => uploadPostImage(file),
  });
