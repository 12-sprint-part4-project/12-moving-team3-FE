import { API_BASE_URL } from '@/lib/apiClient';
import { fetchAndValidate } from '@/services/moverApiResponse';
import { assertMoverAccessToken } from '@/services/moversAuth';
import type { ApiSuccessResponse } from '@/types/api';

export type AddFavoriteResponse = ApiSuccessResponse<{
  id: number;
  userId: string;
  moverId: string;
  createdAt: string;
}>;

export type RemoveFavoriteResponse = ApiSuccessResponse<Record<string, never>>;

const isAddFavoriteResponse = (body: unknown): body is AddFavoriteResponse => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const data = (body as { data?: unknown }).data;
  if (!data || typeof data !== 'object') {
    return false;
  }

  const favorite = data as {
    id?: unknown;
    userId?: unknown;
    moverId?: unknown;
    createdAt?: unknown;
  };

  return (
    typeof favorite.id === 'number' &&
    typeof favorite.userId === 'string' &&
    typeof favorite.moverId === 'string' &&
    typeof favorite.createdAt === 'string'
  );
};

const isRemoveFavoriteResponse = (
  body: unknown
): body is RemoveFavoriteResponse => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const data = (body as { data?: unknown }).data;
  return data !== undefined && typeof data === 'object' && data !== null;
};

/**
 * 기사님 찜하기.
 * POST /api/favorites/:moverId (CUSTOMER)
 * authFetch: 401 시 refresh 1회 후 재시도.
 */
export const addFavorite = async (
  moverId: string
): Promise<AddFavoriteResponse> => {
  assertMoverAccessToken();

  return fetchAndValidate(
    `${API_BASE_URL}/api/favorites/${moverId}`,
    { method: 'POST' },
    isAddFavoriteResponse,
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

  return fetchAndValidate(
    `${API_BASE_URL}/api/favorites/${moverId}`,
    { method: 'DELETE' },
    isRemoveFavoriteResponse,
    '찜 취소에 실패했습니다.'
  );
};
