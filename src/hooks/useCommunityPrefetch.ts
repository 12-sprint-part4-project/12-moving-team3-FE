'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { communityQueryKeys } from '@/constants/queryKey';
import { getCursorNextPageParam } from '@/lib/communityQueryHelpers';
import { getPosts } from '@/services/communityApi';

import type { PostListParams } from '@/types/community';

/** 커뮤니티 목록 쿼리 프리패치 — 탭·필터·정렬 hover 시 사용 */
export const useCommunityPrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchPostList = useCallback(
    (params: PostListParams) => {
      const queryParams = { ...params, limit: params.limit ?? 10 };
      void queryClient.prefetchInfiniteQuery({
        queryKey: communityQueryKeys.list(queryParams),
        queryFn: ({ pageParam }) =>
          getPosts({ ...queryParams, cursor: pageParam as string | undefined }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: getCursorNextPageParam,
      });
    },
    [queryClient]
  );

  return { prefetchPostList };
};
