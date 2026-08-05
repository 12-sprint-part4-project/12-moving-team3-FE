import type { CommentListParams, PostListParams } from '@/types/community';

export const communityQueryKeys = {
  all: ['community'] as const,
  lists: () => [...communityQueryKeys.all, 'list'] as const,
  list: (query: PostListParams) =>
    [...communityQueryKeys.lists(), query] as const,
  details: () => [...communityQueryKeys.all, 'detail'] as const,
  detail: (postId: number) =>
    [...communityQueryKeys.details(), postId] as const,
  comments: () => [...communityQueryKeys.all, 'comments'] as const,
  commentLists: () => [...communityQueryKeys.comments(), 'list'] as const,
  commentList: (postId: number, query: CommentListParams) =>
    [...communityQueryKeys.commentLists(), postId, query] as const,
  neighborLists: () => [...communityQueryKeys.all, 'neighbors'] as const,
  neighbors: (postId: number, query: PostListParams) =>
    [...communityQueryKeys.neighborLists(), postId, query] as const,
};
