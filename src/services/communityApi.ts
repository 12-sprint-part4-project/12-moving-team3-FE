import {
  API_BASE_URL,
  ApiError,
  DEFAULT_API_ERROR_MESSAGE,
  throwApiError,
} from '@/lib/apiClient';
import { authFetch } from '@/lib/authFetch';
import type {
  CreatePostBody,
  PostDetailResponse,
  PostIdResponse,
  PostListQuery,
  PostListResponse,
  UpdatePostBody,
} from '@/types/community';

const BASE_PATH = '/api/posts';

const JSON_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
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
    throw new ApiError(500, DEFAULT_API_ERROR_MESSAGE, 'INVALID_RESPONSE');
  }
};

/** 게시글 목록 조회 쿼리스트링 생성 */
export const buildPostListQueryString = (query: PostListQuery = {}): string => {
  const params = new URLSearchParams();

  if (query.category) params.set('category', query.category);
  if (query.region) params.set('region', query.region);
  if (query.sort) params.set('sort', query.sort);
  if (query.cursor) params.set('cursor', query.cursor);
  if (query.limit !== undefined) params.set('limit', String(query.limit));

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
