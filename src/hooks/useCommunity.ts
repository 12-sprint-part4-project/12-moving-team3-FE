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
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from '@/services/communityApi';
import type {
  CreatePostBody,
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
};

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
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage
        ? (lastPage.meta.nextCursor ?? undefined)
        : undefined,
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
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: communityQueryKeys.detail(postId),
        }),
        queryClient.invalidateQueries({
          queryKey: communityQueryKeys.lists(),
        }),
      ]);
    },
  });
};

/** 게시글 삭제 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: async (_data, postId) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: communityQueryKeys.detail(postId),
        }),
        queryClient.invalidateQueries({
          queryKey: communityQueryKeys.lists(),
        }),
      ]);
    },
  });
};

/** S3 이미지 업로드 */
export const useUploadPostImage = () =>
  useMutation({
    mutationFn: (file: File) => uploadPostImage(file),
  });
