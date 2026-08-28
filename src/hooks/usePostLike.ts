'use client';

import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { useRef } from 'react';

import { communityQueryKeys } from '@/constants/queryKey';
import { likePost, unlikePost } from '@/services/communityApi';

import type {
  PostDetailResponse,
  PostListResponse,
} from '@/types/community';

export interface TogglePostLikeVariables {
  postId: number;
  nextLiked: boolean;
}

/** 게시글 좋아요 / 취소 — throttle 300ms (첫 클릭 즉시 API, 이후 300ms 잠금) */
export const useTogglePostLike = () => {
  const queryClient = useQueryClient();
  const throttleLockRef = useRef(false);

  const mutation = useMutation({
    mutationFn: async ({ postId, nextLiked }: TogglePostLikeVariables) => {
      if (nextLiked) return likePost(postId);
      return unlikePost(postId);
    },
    onMutate: async ({ postId, nextLiked }) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: communityQueryKeys.detail(postId),
        }),
        queryClient.cancelQueries({ queryKey: communityQueryKeys.lists() }),
      ]);

      const previousDetail = queryClient.getQueryData<PostDetailResponse>(
        communityQueryKeys.detail(postId)
      );
      const previousLists =
        queryClient.getQueriesData<InfiniteData<PostListResponse>>({
          queryKey: communityQueryKeys.lists(),
        });

      queryClient.setQueryData<PostDetailResponse>(
        communityQueryKeys.detail(postId),
        (prev) => {
          if (!prev?.data) return prev;
          const delta =
            typeof prev.data.isLiked === 'boolean' &&
            prev.data.isLiked !== nextLiked
              ? nextLiked
                ? 1
                : -1
              : 0;
          return {
            ...prev,
            data: {
              ...prev.data,
              isLiked: nextLiked,
              likeCount: prev.data.likeCount + delta,
            },
          };
        }
      );

      queryClient.setQueriesData<InfiniteData<PostListResponse>>(
        { queryKey: communityQueryKeys.lists() },
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            pages: prev.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.map((item) => {
                  if (item.id !== postId) return item;
                  const delta =
                    typeof item.isLiked === 'boolean' &&
                    item.isLiked !== nextLiked
                      ? nextLiked
                        ? 1
                        : -1
                      : 0;
                  return {
                    ...item,
                    isLiked: nextLiked,
                    likeCount: item.likeCount + delta,
                  };
                }),
              },
            })),
          };
        }
      );

      return { previousDetail, previousLists };
    },
    onError: (_err, { postId }, context) => {
      if (context?.previousDetail !== undefined) {
        queryClient.setQueryData(
          communityQueryKeys.detail(postId),
          context.previousDetail
        );
      }

      // 전체 목록 스냅샷 복원 대신 해당 게시글만 롤백 — 다른 mutation의 낙관적 업데이트 보존
      const prevPost = context?.previousLists
        ?.flatMap(([, data]) => data?.pages.flatMap((p) => p.data.items) ?? [])
        .find((item) => item.id === postId);

      if (prevPost) {
        queryClient.setQueriesData<InfiniteData<PostListResponse>>(
          { queryKey: communityQueryKeys.lists() },
          (prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              pages: prev.pages.map((page) => ({
                ...page,
                data: {
                  ...page.data,
                  items: page.data.items.map((item) =>
                    item.id === postId
                      ? {
                          ...item,
                          isLiked: prevPost.isLiked,
                          likeCount: prevPost.likeCount,
                        }
                      : item
                  ),
                },
              })),
            };
          }
        );
      }
    },
  });

  const togglePostLike = (
    postId: number,
    nextLiked: boolean,
    options?: { onError?: (error: unknown) => void }
  ): void => {
    if (throttleLockRef.current) return;

    throttleLockRef.current = true;
    setTimeout(() => {
      throttleLockRef.current = false;
    }, 300);

    mutation.mutate({ postId, nextLiked }, options);
  };

  return { ...mutation, togglePostLike };
};
