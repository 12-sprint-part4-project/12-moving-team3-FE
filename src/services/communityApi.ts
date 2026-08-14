import { API_ERROR_CODE } from '@/constants/errorCode';
import {
  API_BASE_URL,
  ApiError,
  DEFAULT_API_ERROR_MESSAGE,
  throwApiError,
} from '@/lib/apiClient';
import { authFetch } from '@/lib/authFetch';
import {
  commentListResponseSchema,
  postDetailResponseSchema,
  postIdResponseSchema,
  postListResponseSchema,
  postLikeResponseSchema,
  postNeighborsResponseSchema,
} from '@/lib/communitySchema';

import type {
  CommentListQuery,
  CommentListResponse,
  CreateCommentBody,
  CreatePostBody,
  PostDetailResponse,
  PostIdResponse,
  PostLikeResponse,
  PostListParams,
  PostListQuery,
  PostListResponse,
  PostNeighborsResponse,
  UpdatePostBody,
} from '@/types/community';

const BASE_PATH = '/api/posts';

const JSON_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
};

const appendCursorPaginationParams = (
  params: URLSearchParams,
  query: Pick<PostListQuery, 'cursor' | 'limit'>
): void => {
  if (query.cursor) params.set('cursor', query.cursor);
  if (query.limit !== undefined) params.set('limit', String(query.limit));
};

/** 인증이 필요한 JSON API 요청 공통 처리 */
const communityFetch = async (
  path: string,
  init: RequestInit = {}
): Promise<unknown> => {
  const headers = new Headers(JSON_HEADERS);
  new Headers(init.headers).forEach((value, key) => {
    headers.set(key, value);
  });

  const response = await authFetch(`${API_BASE_URL}${path}`, {
    cache: 'no-store',
    ...init,
    headers,
  });

  if (!response.ok) {
    return throwApiError(response);
  }

  if (response.status === 204) {
    return undefined;
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError(
      500,
      DEFAULT_API_ERROR_MESSAGE,
      API_ERROR_CODE.INVALID_RESPONSE
    );
  }
};

/** safeParse 실패 시 INVALID_RESPONSE 에러 */
const parseOrThrow = <T>(
  schema: { safeParse: (data: unknown) => { success: true; data: T } | { success: false } },
  body: unknown
): T => {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError(
      500,
      DEFAULT_API_ERROR_MESSAGE,
      API_ERROR_CODE.INVALID_RESPONSE
    );
  }
  return parsed.data;
};

/** 게시글 목록 조회 쿼리스트링 생성 */
export const buildPostListQueryString = (query: PostListQuery = {}): string => {
  const params = new URLSearchParams();

  if (query.category) params.set('category', query.category);
  if (query.region) params.set('region', query.region);
  if (query.sort) params.set('sort', query.sort);
  if (query.keyword) params.set('keyword', query.keyword);
  if (query.hideCompleted) params.set('hideCompleted', 'true');
  appendCursorPaginationParams(params, query);

  const qs = params.toString();
  return qs ? `?${qs}` : '';
};

/** 댓글 목록 조회 쿼리스트링 생성 */
export const buildCommentListQueryString = (
  query: CommentListQuery = {}
): string => {
  const params = new URLSearchParams();
  appendCursorPaginationParams(params, query);

  const qs = params.toString();
  return qs ? `?${qs}` : '';
};

/** 게시글 목록 조회 */
export const getPosts = async (
  query: PostListQuery = {}
): Promise<PostListResponse> => {
  const body = await communityFetch(
    `${BASE_PATH}${buildPostListQueryString(query)}`,
    { method: 'GET' }
  );
  return parseOrThrow(postListResponseSchema, body);
};

/** 게시글 상세 조회 */
export const getPostById = async (
  postId: number
): Promise<PostDetailResponse> => {
  const body = await communityFetch(`${BASE_PATH}/${postId}`, {
    method: 'GET',
  });
  return parseOrThrow(postDetailResponseSchema, body);
};

/** 게시글 이전/다음글 조회 */
export const getPostNeighbors = async (
  postId: number,
  query: PostListParams = {}
): Promise<PostNeighborsResponse> => {
  const body = await communityFetch(
    `${BASE_PATH}/${postId}/neighbors${buildPostListQueryString(query)}`,
    { method: 'GET' }
  );
  return parseOrThrow(postNeighborsResponseSchema, body);
};

/** 게시글 작성 */
export const createPost = async (
  body: CreatePostBody
): Promise<PostIdResponse> => {
  const result = await communityFetch(BASE_PATH, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return parseOrThrow(postIdResponseSchema, result);
};

/** 게시글 수정 */
export const updatePost = async (
  postId: number,
  body: UpdatePostBody
): Promise<PostIdResponse> => {
  const result = await communityFetch(`${BASE_PATH}/${postId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  return parseOrThrow(postIdResponseSchema, result);
};

/** 게시글 삭제 */
export const deletePost = async (postId: number): Promise<void> => {
  await communityFetch(`${BASE_PATH}/${postId}`, { method: 'DELETE' });
};

/** 가구 나눔 게시글 나눔 완료 */
export const completePost = async (
  postId: number
): Promise<PostIdResponse> => {
  const result = await communityFetch(`${BASE_PATH}/${postId}/complete`, {
    method: 'PATCH',
  });
  return parseOrThrow(postIdResponseSchema, result);
};

/** 댓글 목록 조회 */
export const getComments = async (
  postId: number,
  query: CommentListQuery = {}
): Promise<CommentListResponse> => {
  const body = await communityFetch(
    `${BASE_PATH}/${postId}/comments${buildCommentListQueryString(query)}`,
    { method: 'GET' }
  );
  return parseOrThrow(commentListResponseSchema, body);
};

/** 댓글 작성 */
export const createComment = async (
  postId: number,
  body: CreateCommentBody
): Promise<PostIdResponse> => {
  const result = await communityFetch(`${BASE_PATH}/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return parseOrThrow(postIdResponseSchema, result);
};

/** 대댓글 작성 */
export const createReply = async (
  postId: number,
  commentId: number,
  body: CreateCommentBody
): Promise<PostIdResponse> => {
  const result = await communityFetch(
    `${BASE_PATH}/${postId}/comments/${commentId}/replies`,
    { method: 'POST', body: JSON.stringify(body) }
  );
  return parseOrThrow(postIdResponseSchema, result);
};

/** 댓글 삭제 */
export const deleteComment = async (
  postId: number,
  commentId: number
): Promise<void> => {
  await communityFetch(`${BASE_PATH}/${postId}/comments/${commentId}`, {
    method: 'DELETE',
  });
};

/** 게시글 좋아요 */
export const likePost = async (
  postId: number
): Promise<PostLikeResponse> => {
  const result = await communityFetch(`${BASE_PATH}/${postId}/likes`, {
    method: 'POST',
  });
  return parseOrThrow(postLikeResponseSchema, result);
};

/** 게시글 좋아요 취소 */
export const unlikePost = async (postId: number): Promise<void> => {
  await communityFetch(`${BASE_PATH}/${postId}/likes`, { method: 'DELETE' });
};

/** 게시글 조회수 기록 */
export const recordPostView = async (postId: number): Promise<void> => {
  await communityFetch(`${BASE_PATH}/${postId}/views`, { method: 'POST' });
};
