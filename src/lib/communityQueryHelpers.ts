import {
  type InfiniteData,
  type QueryKey,
  type QueryClient,
} from '@tanstack/react-query';

import { communityQueryKeys } from '@/constants/queryKey';

import type {
  CommentListMeta,
  CommentListResponse,
  PostDetailResponse,
  PostListResponse,
} from '@/types/community';

export const getCursorNextPageParam = (lastPage: {
  meta: CommentListMeta;
}): string | undefined =>
  lastPage.meta.hasNextPage
    ? (lastPage.meta.nextCursor ?? undefined)
    : undefined;

export const invalidatePostSummary = (
  queryClient: QueryClient,
  postId: number
) =>
  Promise.all([
    queryClient.invalidateQueries({
      queryKey: communityQueryKeys.detail(postId),
    }),
    queryClient.invalidateQueries({
      queryKey: communityQueryKeys.lists(),
    }),
  ]);

export const invalidatePostComments = (
  queryClient: QueryClient,
  postId: number
) =>
  queryClient.invalidateQueries({
    queryKey: [...communityQueryKeys.commentLists(), postId],
  });

export const invalidatePostEngagement = (
  queryClient: QueryClient,
  postId: number
) =>
  Promise.all([
    invalidatePostSummary(queryClient, postId),
    invalidatePostComments(queryClient, postId),
  ]);

export const markPostCompletedInCache = (
  queryClient: QueryClient,
  postId: number
) => {
  queryClient.setQueryData<PostDetailResponse>(
    communityQueryKeys.detail(postId),
    (previous) => {
      if (previous?.data === undefined) return previous;
      return { ...previous, data: { ...previous.data, isCompleted: true } };
    }
  );

  queryClient.setQueriesData<InfiniteData<PostListResponse>>(
    { queryKey: communityQueryKeys.lists() },
    (previous) => {
      if (previous === undefined) return previous;
      return {
        ...previous,
        pages: previous.pages.map((page) => ({
          ...page,
          data: {
            ...page.data,
            items: page.data.items.map((item) =>
              item.id === postId ? { ...item, isCompleted: true } : item
            ),
          },
        })),
      };
    }
  );
};

export const removePostFromCache = (
  queryClient: QueryClient,
  postId: number
) => {
  queryClient.removeQueries({
    queryKey: communityQueryKeys.detail(postId),
  });
  queryClient.removeQueries({
    queryKey: [...communityQueryKeys.neighborLists(), postId],
  });
};

export const rollbackCommentQueries = (
  queryClient: QueryClient,
  previousComments: [QueryKey, InfiniteData<CommentListResponse> | undefined][]
) => {
  for (const [key, data] of previousComments) {
    queryClient.setQueryData(key, data);
  }
};
