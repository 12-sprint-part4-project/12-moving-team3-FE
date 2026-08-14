import { API_ERROR_CODE } from '@/constants/errorCode';
import {
  API_BASE_URL,
  ApiError,
  DEFAULT_API_ERROR_MESSAGE,
  throwApiError,
} from '@/lib/apiClient';
import { authFetch } from '@/lib/authFetch';

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
const communityFetch = async <T>(
  path: string,
  init: RequestInit = {}
): Promise<T> => {
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
    return undefined as T;
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError(
      500,
      DEFAULT_API_ERROR_MESSAGE,
      API_ERROR_CODE.INVALID_RESPONSE
    );
  }
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

/** 게시글 목록 조회 */
export const getPosts = (
  query: PostListQuery = {}
): Promise<PostListResponse> =>
  communityFetch<PostListResponse>(
    `${BASE_PATH}${buildPostListQueryString(query)}`,
    { method: 'GET' }
  );

/** 게시글 상세 조회 */
export const getPostById = (postId: number): Promise<PostDetailResponse> =>
  communityFetch<PostDetailResponse>(`${BASE_PATH}/${postId}`, {
    method: 'GET',
  });

/** 게시글 이전/다음글 조회 — GET /api/posts/:postId/neighbors */
export const getPostNeighbors = (
  postId: number,
  query: PostListParams = {}
): Promise<PostNeighborsResponse> =>
  communityFetch<PostNeighborsResponse>(
    `${BASE_PATH}/${postId}/neighbors${buildPostListQueryString(query)}`,
    { method: 'GET' }
  );

/** 게시글 작성 */
export const createPost = (body: CreatePostBody): Promise<PostIdResponse> =>
  communityFetch<PostIdResponse>(BASE_PATH, {
    method: 'POST',
    body: JSON.stringify(body),
  });

/** 게시글 수정 */
export const updatePost = (
  postId: number,
  body: UpdatePostBody
): Promise<PostIdResponse> =>
  communityFetch<PostIdResponse>(`${BASE_PATH}/${postId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

/** 게시글 삭제 */
export const deletePost = (postId: number): Promise<void> =>
  communityFetch<void>(`${BASE_PATH}/${postId}`, {
    method: 'DELETE',
  });

/** 가구 나눔 게시글 나눔 완료 */
export const completePost = (postId: number): Promise<PostIdResponse> =>
  communityFetch<PostIdResponse>(`${BASE_PATH}/${postId}/complete`, {
    method: 'PATCH',
  });

/** 댓글 목록 조회 쿼리스트링 생성 */
export const buildCommentListQueryString = (
  query: CommentListQuery = {}
): string => {
  const params = new URLSearchParams();
  appendCursorPaginationParams(params, query);

  const qs = params.toString();
  return qs ? `?${qs}` : '';
};

/** 댓글 목록 조회 */
export const getComments = (
  postId: number,
  query: CommentListQuery = {}
): Promise<CommentListResponse> =>
  communityFetch<CommentListResponse>(
    `${BASE_PATH}/${postId}/comments${buildCommentListQueryString(query)}`,
    { method: 'GET' }
  );

/** 댓글 작성 */
export const createComment = (
  postId: number,
  body: CreateCommentBody
): Promise<PostIdResponse> =>
  communityFetch<PostIdResponse>(`${BASE_PATH}/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

/** 대댓글 작성 */
export const createReply = (
  postId: number,
  commentId: number,
  body: CreateCommentBody
): Promise<PostIdResponse> =>
  communityFetch<PostIdResponse>(
    `${BASE_PATH}/${postId}/comments/${commentId}/replies`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    }
  );

/** 댓글 삭제 */
export const deleteComment = (
  postId: number,
  commentId: number
): Promise<void> =>
  communityFetch<void>(`${BASE_PATH}/${postId}/comments/${commentId}`, {
    method: 'DELETE',
  });

/** 게시글 좋아요 */
export const likePost = (postId: number): Promise<PostLikeResponse> =>
  communityFetch<PostLikeResponse>(`${BASE_PATH}/${postId}/likes`, {
    method: 'POST',
  });

/** 게시글 좋아요 취소 */
export const unlikePost = (postId: number): Promise<void> =>
  communityFetch<void>(`${BASE_PATH}/${postId}/likes`, {
    method: 'DELETE',
  });

/** 게시글 조회수 기록 — POST /api/posts/:postId/views */
export const recordPostView = (postId: number): Promise<void> =>
  communityFetch<void>(`${BASE_PATH}/${postId}/views`, {
    method: 'POST',
  });
