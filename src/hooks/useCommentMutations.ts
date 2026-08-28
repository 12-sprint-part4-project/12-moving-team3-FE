'use client';

import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';

import { communityQueryKeys } from '@/constants/queryKey';
import { useAuth } from '@/hooks/useAuth';
import {
  invalidatePostEngagement,
  rollbackCommentQueries,
} from '@/lib/communityQueryHelpers';
import {
  createComment,
  createReply,
  deleteComment,
} from '@/services/communityApi';

import type {
  CommentItem,
  CommentListResponse,
  CommentWithReplies,
  CreateCommentBody,
  CreateReplyBody,
} from '@/types/community';

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
        rollbackCommentQueries(queryClient, context.previousComments);
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
                      ? { ...comment, replies: [...comment.replies, tempReply] }
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
        rollbackCommentQueries(queryClient, context.previousComments);
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
        rollbackCommentQueries(queryClient, context.previousComments);
      }
    },
    onSettled: async () => {
      await invalidatePostEngagement(queryClient, postId);
    },
  });
};
