'use client';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { communityQueryKeys } from '@/constants/queryKey';
import { getCursorNextPageParam } from '@/lib/communityQueryHelpers';
import { getPosts } from '@/services/communityApi';

import type { PostListParams } from '@/types/community';

/** 게시글 목록 무한스크롤 조회 */
export const usePostList = ({
  limit = 10,
  category,
  region,
  sort,
  keyword,
  hideCompleted,
}: PostListParams = {}) => {
  const queryParams = useMemo(
    () => ({ category, region, sort, keyword, limit, hideCompleted }),
    [category, region, sort, keyword, limit, hideCompleted]
  );

  const query = useInfiniteQuery({
    queryKey: communityQueryKeys.list(queryParams),
    queryFn: ({ pageParam }) => getPosts({ ...queryParams, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: getCursorNextPageParam,
    placeholderData: keepPreviousData,
  });

  const posts = useMemo(
    () => query.data?.pages.flatMap((page) => page.data.items) ?? [],
    [query.data]
  );

  return {
    ...query,
    posts,
    isEmpty: !query.isPending && !query.isError && posts.length === 0,
    isPlaceholderData: query.isPlaceholderData,
  };
};
