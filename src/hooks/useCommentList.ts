'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { communityQueryKeys } from '@/constants/queryKey';
import { getCursorNextPageParam } from '@/lib/communityQueryHelpers';
import { getComments } from '@/services/communityApi';

import type { CommentListParams } from '@/types/community';

/** 댓글 목록 무한스크롤 조회 */
export const useCommentList = (
  postId: number,
  { limit = 10 }: CommentListParams = {}
) => {
  const queryParams = useMemo(() => ({ limit }), [limit]);

  const query = useInfiniteQuery({
    queryKey: communityQueryKeys.commentList(postId, queryParams),
    queryFn: ({ pageParam }) =>
      getComments(postId, { ...queryParams, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: getCursorNextPageParam,
    enabled: postId > 0,
  });

  const comments = useMemo(
    () => query.data?.pages.flatMap((page) => page.data.items) ?? [],
    [query.data]
  );

  return {
    ...query,
    comments,
    isEmpty: !query.isPending && !query.isError && comments.length === 0,
  };
};
