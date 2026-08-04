import {
  API_BASE_URL,
  ApiError,
  createApiTimeoutSignal,
  throwApiError,
} from '@/lib/apiClient';
import { authFetch } from '@/lib/authFetch';
import type {
  MoverProfileMe,
  MoverProfileMeResponse,
  MoverProfileResponse,
  UpsertMoverProfileRequest,
} from '@/types/moverProfile';

const PROFILE_PATH = '/api/users/movers/profile';

/** GET /api/users/movers/profile */
export const getMoverProfile = async (): Promise<MoverProfileMeResponse> => {
  const response = await authFetch(`${API_BASE_URL}${PROFILE_PATH}`, {
    method: 'GET',
    signal: createApiTimeoutSignal(),
  });

  if (!response.ok) {
    return throwApiError(response);
  }

  return (await response.json()) as MoverProfileMeResponse;
};

/**
 * 본인 프로필 data 조회.
 * 미등록(404)이면 null을 반환한다.
 */
export const getMoverProfileMe = async (): Promise<MoverProfileMe | null> => {
  try {
    const response = await getMoverProfile();
    return response.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
};

/** PATCH /api/users/movers/profile */
export const upsertMoverProfile = async (
  body: UpsertMoverProfileRequest
): Promise<MoverProfileResponse> => {
  const response = await authFetch(`${API_BASE_URL}${PROFILE_PATH}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: createApiTimeoutSignal(),
  });

  if (!response.ok) {
    return throwApiError(response);
  }

  return (await response.json()) as MoverProfileResponse;
};
