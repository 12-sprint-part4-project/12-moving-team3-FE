'use client';

import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { useAuth } from '@/hooks/useAuth';

import { findPostNeighborsInListCache } from '@/lib/communityPostNeighbors';
import { communityQueryKeys } from '@/lib/communityQueryKeys';

import {
  hasRecordedPostViewInSession,
  markPostViewRecordedInSession,
} from '@/lib/postViewTracking';
import { uploadPostImage } from '@/lib/uploadPostImage';
import {
  completePost,
  createComment,
  createPost,
  createReply,
  deleteComment,
  deletePost,
  getComments,
  getPostById,
  getPostNeighbors,
  getPosts,
  likePost,
  recordPostView,
  unlikePost,
  updatePost,
} from '@/services/communityApi';
import type {
  CommentItem,
  CommentListMeta,
  CommentListParams,
  CommentListResponse,
  CommentWithReplies,
  CreateCommentBody,
  CreatePostBody,
  CreateReplyBody,
  PostDetailResponse,
  PostListParams,
  PostListResponse,
  UpdatePostBody,
} from '@/types/community';

export { communityQueryKeys } from '@/lib/communityQueryKeys';

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

const markPostCompletedInCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  postId: number
) => {
  queryClient.setQueryData<PostDetailResponse>(
    communityQueryKeys.detail(postId),
    (previous) => {
      if (previous?.data === undefined) {
        return previous;
      }

      return {
        ...previous,
        data: {
          ...previous.data,
          isCompleted: true,
        },
      };
    }
  );

  queryClient.setQueriesData<InfiniteData<PostListResponse>>(
    { queryKey: communityQueryKeys.lists() },
    (previous) => {
      if (previous === undefined) {
        return previous;
      }

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
  keyword,
}: PostListParams = {}) => {
  const queryParams = useMemo(
    () => ({ category, region, sort, keyword, limit }),
    [category, region, sort, keyword, limit]
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

/** 게시글 상세 조회 */
export const usePost = (postId: number) =>
  useQuery({
    queryKey: communityQueryKeys.detail(postId),
    queryFn: () => getPostById(postId),
    select: (response) => response.data,
    enabled: postId > 0,
  });

/** 게시글 이전/다음글 조회 — BE 우선, 목록 캐시 fallback */
export const usePostNeighbors = (
  postId: number,
  listParams: PostListParams = {}
) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: communityQueryKeys.neighbors(postId, listParams),
    queryFn: () => getPostNeighbors(postId, listParams),
    select: (response) => response.data,
    enabled: postId > 0,
    retry: false,
  });

  const cachedNeighbors = useMemo(
    () => findPostNeighborsInListCache(queryClient, postId, listParams),
    [queryClient, postId, listParams]
  );

  const neighbors = query.data ?? cachedNeighbors;

  return {
    ...query,
    neighbors,
  };
};

/**
 * 게시글 조회수 BE 전송 — 상세 로드 성공 후 세션당 1회.
 * UI에 조회수를 표시하지 않으며, 실패해도 사용자에게 노출하지 않는다.
 */
const inFlightPostViewIds = new Set<number>();

export const useRecordPostView = (postId: number, enabled: boolean) => {
  useEffect(() => {
    if (!enabled || postId <= 0) {
      return;
    }

    if (hasRecordedPostViewInSession(postId)) {
      return;
    }

    if (inFlightPostViewIds.has(postId)) {
      return;
    }

    inFlightPostViewIds.add(postId);

    void recordPostView(postId)
      .then(() => {
        markPostViewRecordedInSession(postId);
      })
      .catch(() => {
        // BE 미구현·네트워크 오류 — UI 영향 없음
      })
      .finally(() => {
        inFlightPostViewIds.delete(postId);
      });
  }, [postId, enabled]);
};

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
    onMutate: async ({ postId, nextLiked }) => {
      await queryClient.cancelQueries({
        queryKey: communityQueryKeys.detail(postId),
      });

      const previousDetail = queryClient.getQueryData<PostDetailResponse>(
        communityQueryKeys.detail(postId)
      );

      queryClient.setQueryData<PostDetailResponse>(
        communityQueryKeys.detail(postId),
        (prev) => {
          if (!prev?.data) return prev;
          return {
            ...prev,
            data: {
              ...prev.data,
              isLiked: nextLiked,
              likeCount: prev.data.likeCount + (nextLiked ? 1 : -1),
            },
          };
        }
      );

      return { previousDetail };
    },
    onError: (_err, { postId }, context) => {
      if (context?.previousDetail !== undefined) {
        queryClient.setQueryData(
          communityQueryKeys.detail(postId),
          context.previousDetail
        );
      }
    },
    onSettled: async (_data, _err, { postId }) => {
      await invalidatePostSummary(queryClient, postId);
    },
  });

  const togglePostLike = (
    postId: number,
    nextLiked: boolean,
    options?: { onError?: (error: unknown) => void }
  ): void => {
    if (mutation.isPending) {
      return;
    }
    mutation.mutate({ postId, nextLiked }, options);
  };

  return {
    ...mutation,
    togglePostLike,
  };
};

/** 댓글 작성 */
export const useCreateComment = (postId: number) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (body: CreateCommentBody) => createComment(postId, body),
    onMutate: async ({ content }) => {
      const commentListKey = communityQueryKeys.commentListsByPost(postId);
      await queryClient.cancelQueries({ queryKey: commentListKey });

      const previousComments = queryClient.getQueriesData<
        InfiniteData<CommentListResponse>
      >({ queryKey: commentListKey });

      if (user) {
        const tempComment: CommentWithReplies = {
          id: -Date.now(),
          content,
          author: {
            id: user.id,
            nickname: user.nickname,
            profileImageUrl: null, // AuthUser에 profileImageUrl 없음
          },
          isMine: true,
          createdAt: new Date().toISOString(),
          replies: [],
        };

        queryClient.setQueriesData<InfiniteData<CommentListResponse>>(
          { queryKey: commentListKey },
          (prev) => {
            if (!prev?.pages.length) return prev;
            const pages = [...prev.pages];
            const lastPage = pages[pages.length - 1];
            pages[pages.length - 1] = {
              ...lastPage,
              data: {
                ...lastPage.data,
                items: [...lastPage.data.items, tempComment],
              },
            };
            return { ...prev, pages };
          }
        );
      }

      return { previousComments };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousComments) {
        for (const [key, data] of context.previousComments) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: async () => {
      await invalidatePostEngagement(queryClient, postId);
    },
  });
};

/** 대댓글 작성 */
export const useCreateReply = (postId: number) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ commentId, content }: CreateReplyBody) =>
      createReply(postId, commentId, { content }),
    onMutate: async ({ commentId, content }) => {
      const commentListKey = communityQueryKeys.commentListsByPost(postId);
      await queryClient.cancelQueries({ queryKey: commentListKey });

      const previousComments = queryClient.getQueriesData<
        InfiniteData<CommentListResponse>
      >({ queryKey: commentListKey });

      if (user) {
        const tempReply: CommentItem = {
          id: -Date.now(),
          content,
          author: {
            id: user.id,
            nickname: user.nickname,
            profileImageUrl: null, // AuthUser에 profileImageUrl 없음
          },
          isMine: true,
          createdAt: new Date().toISOString(),
        };

        queryClient.setQueriesData<InfiniteData<CommentListResponse>>(
          { queryKey: commentListKey },
          (prev) => {
            if (!prev?.pages.length) return prev;
            return {
              ...prev,
              pages: prev.pages.map((page) => ({
                ...page,
                data: {
                  ...page.data,
                  items: page.data.items.map((comment) =>
                    comment.id === commentId
                      ? {
                          ...comment,
                          replies: [...comment.replies, tempReply],
                        }
                      : comment
                  ),
                },
              })),
            };
          }
        );
      }

      return { previousComments };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousComments) {
        for (const [key, data] of context.previousComments) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: async () => {
      await invalidatePostEngagement(queryClient, postId);
    },
  });
};

/** 댓글 삭제 */
export const useDeleteComment = (postId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(postId, commentId),
    onMutate: async (commentId) => {
      const commentListKey = communityQueryKeys.commentListsByPost(postId);
      await queryClient.cancelQueries({ queryKey: commentListKey });

      const previousComments = queryClient.getQueriesData<
        InfiniteData<CommentListResponse>
      >({ queryKey: commentListKey });

      queryClient.setQueriesData<InfiniteData<CommentListResponse>>(
        { queryKey: commentListKey },
        (prev) => {
          if (!prev?.pages.length) return prev;
          return {
            ...prev,
            pages: prev.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items
                  .filter((comment) => comment.id !== commentId)
                  .map((comment) => ({
                    ...comment,
                    replies: comment.replies.filter(
                      (reply) => reply.id !== commentId
                    ),
                  })),
              },
            })),
          };
        }
      );

      return { previousComments };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousComments) {
        for (const [key, data] of context.previousComments) {
          queryClient.setQueryData(key, data);
        }
      }
    },
    onSettled: async () => {
      await invalidatePostEngagement(queryClient, postId);
    },
  });
};
