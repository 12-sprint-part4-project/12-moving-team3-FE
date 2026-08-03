'use client';

import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useMemo } from 'react';

import { uploadPostImage } from '@/lib/uploadPostImage';
import {
  createComment,
  createPost,
  createReply,
  deleteComment,
  deletePost,
  getComments,
  getPostById,
  getPosts,
  likePost,
  unlikePost,
  updatePost,
} from '@/services/communityApi';
import type {
  CommentListMeta,
  CommentListParams,
  CreateCommentBody,
  CreatePostBody,
  CreateReplyBody,
  PostListParams,
  UpdatePostBody,
} from '@/types/community';

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
};

export interface TogglePostLikeVariables {
  postId: number;
  nextLiked: boolean;
}

const getCursorNextPageParam = (lastPage: {
  meta: CommentListMeta;
}): string | undefined =>
  lastPage.meta.hasNextPage
    ? (lastPage.meta.nextCursor ?? undefined)
    : undefined;

const invalidatePostSummary = (
  queryClient: ReturnType<typeof useQueryClient>,
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

const invalidatePostComments = (
  queryClient: ReturnType<typeof useQueryClient>,
  postId: number
) =>
  queryClient.invalidateQueries({
    queryKey: [...communityQueryKeys.commentLists(), postId],
  });

const invalidatePostEngagement = (
  queryClient: ReturnType<typeof useQueryClient>,
  postId: number
) =>
  Promise.all([
    invalidatePostSummary(queryClient, postId),
    invalidatePostComments(queryClient, postId),
  ]);

/** 게시글 목록 무한스크롤 조회 */
export const usePostList = ({
  limit = 10,
  category,
  region,
  sort,
}: PostListParams = {}) => {
  const queryParams = useMemo(
    () => ({ category, region, sort, limit }),
    [category, region, sort, limit]
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
  };
};

/** 게시글 상세 조회 */
export const usePost = (postId: number) =>
  useQuery({
    queryKey: communityQueryKeys.detail(postId),
    queryFn: () => getPostById(postId),
    select: (response) => response.data,
    enabled: postId > 0,
  });

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
      await invalidatePostSummary(queryClient, postId);
    },
  });
};

/** S3 이미지 업로드 */
export const useUploadPostImage = () =>
  useMutation({
    mutationFn: (file: File) => uploadPostImage(file),
  });

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

/** 게시글 좋아요 / 취소 */
export const useTogglePostLike = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ postId, nextLiked }: TogglePostLikeVariables) => {
      if (nextLiked) {
        return likePost(postId);
      }
      return unlikePost(postId);
    },
    onSuccess: async (_data, { postId }) => {
      await invalidatePostSummary(queryClient, postId);
    },
  });

  const togglePostLike = (postId: number, nextLiked: boolean): void => {
    if (mutation.isPending) {
      return;
    }
    mutation.mutate({ postId, nextLiked });
  };

  return {
    ...mutation,
    togglePostLike,
  };
};

/** 댓글 작성 */
export const useCreateComment = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateCommentBody) => createComment(postId, body),
    onSuccess: async () => {
      await invalidatePostEngagement(queryClient, postId);
    },
  });
};

/** 대댓글 작성 */
export const useCreateReply = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: CreateReplyBody) =>
      createReply(postId, commentId, { content }),
    onSuccess: async () => {
      await invalidatePostEngagement(queryClient, postId);
    },
  });
};

/** 댓글 삭제 */
export const useDeleteComment = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(postId, commentId),
    onSuccess: async () => {
      await invalidatePostEngagement(queryClient, postId);
    },
  });
};
