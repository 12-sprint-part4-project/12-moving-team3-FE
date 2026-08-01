import { ApiError } from '@/lib/apiClient';
import {
  API_BASE_URL,
  createApiTimeoutSignal,
} from '@/services/apiClient.legacy';
import { getMoverAccessToken } from '@/services/moversAuth';
import type { ApiErrorBody, ApiSuccessResponse } from '@/types/api';

const getRequiredAuthHeaders = (): HeadersInit => {
  const token = getMoverAccessToken();

  if (!token) {
    throw new ApiError(401, '로그인이 필요한 기능입니다.', 'UNAUTHORIZED');
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const parseErrorBody = (body: unknown): ApiErrorBody | null =>
  body && typeof body === 'object' ? (body as ApiErrorBody) : null;

export type AddFavoriteResponse = ApiSuccessResponse<{
  id: number;
  userId: string;
  moverId: string;
  createdAt: string;
}>;

export type RemoveFavoriteResponse = ApiSuccessResponse<Record<string, never>>;

/**
 * 기사님 찜하기.
 * POST /api/favorites/:moverId (CUSTOMER)
 */
export const addFavorite = async (
  moverId: string
): Promise<AddFavoriteResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/favorites/${moverId}`, {
    method: 'POST',
    credentials: 'include',
    cache: 'no-store',
    headers: getRequiredAuthHeaders(),
    signal: createApiTimeoutSignal(),
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody = parseErrorBody(body);
    throw new ApiError(
      response.status,
      errorBody?.error?.message ?? '찜하기에 실패했습니다.',
      errorBody?.error?.code ?? 'UNKNOWN_ERROR'
    );
  }

  return body as AddFavoriteResponse;
};

/**
 * 기사님 찜 취소.
 * DELETE /api/favorites/:moverId (CUSTOMER)
 */
export const removeFavorite = async (
  moverId: string
): Promise<RemoveFavoriteResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/favorites/${moverId}`, {
    method: 'DELETE',
    credentials: 'include',
    cache: 'no-store',
    headers: getRequiredAuthHeaders(),
    signal: createApiTimeoutSignal(),
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody = parseErrorBody(body);
    throw new ApiError(
      response.status,
      errorBody?.error?.message ?? '찜 취소에 실패했습니다.',
      errorBody?.error?.code ?? 'UNKNOWN_ERROR'
    );
  }

  return body as RemoveFavoriteResponse;
};
