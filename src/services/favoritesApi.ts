import {
  API_BASE_URL,
  authFetch,
  createApiTimeoutSignal,
} from '@/services/apiClient.legacy';
import { parseMoverApiResponse } from '@/services/moverApiResponse';
import { assertMoverAccessToken } from '@/services/moversAuth';
import type { ApiSuccessResponse } from '@/types/api';

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

  return parseMoverApiResponse<AddFavoriteResponse>(
    response,
    '찜하기에 실패했습니다.'
  );
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

  return parseMoverApiResponse<RemoveFavoriteResponse>(
    response,
    '찜 취소에 실패했습니다.'
  );
};
