import { ApiError } from '@/lib/apiClient';
import {
  API_BASE_URL,
  authFetch,
  createApiTimeoutSignal,
} from '@/services/apiClient.legacy';
import { assertMoverAccessToken } from '@/services/moversAuth';
import type { ApiErrorBody, ApiSuccessResponse } from '@/types/api';

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
 * authFetch: 401 시 refresh 1회 후 재시도.
 */
export const addFavorite = async (
  moverId: string
): Promise<AddFavoriteResponse> => {
  assertMoverAccessToken();

  const response = await authFetch(`${API_BASE_URL}/api/favorites/${moverId}`, {
    method: 'POST',
    cache: 'no-store',
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
 * authFetch: 401 시 refresh 1회 후 재시도.
 */
export const removeFavorite = async (
  moverId: string
): Promise<RemoveFavoriteResponse> => {
  assertMoverAccessToken();

  const response = await authFetch(`${API_BASE_URL}/api/favorites/${moverId}`, {
    method: 'DELETE',
    cache: 'no-store',
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
