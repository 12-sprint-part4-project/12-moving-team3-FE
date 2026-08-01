import { ApiError } from '@/lib/apiClient';
import {
  API_BASE_URL,
  authFetch,
  createApiTimeoutSignal,
} from '@/services/apiClient.legacy';
import type { ApiErrorBody } from '@/types/api';
import type {
  CustomerProfileMeResponse,
  CustomerProfileResponse,
  UpsertCustomerProfileRequest,
} from '@/types/customerProfile';

const PROFILE_PATH = '/api/users/customers/profile';

const parseError = async (response: Response): Promise<never> => {
  const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
  throw new ApiError(
    response.status,
    body?.error?.message ?? '요청 처리 중 오류가 발생했습니다.',
    body?.error?.code ?? 'UNKNOWN_ERROR'
  );
};

/** GET /api/users/customers/profile */
export const getCustomerProfile =
  async (): Promise<CustomerProfileMeResponse> => {
    const response = await authFetch(`${API_BASE_URL}${PROFILE_PATH}`, {
      method: 'GET',
      signal: createApiTimeoutSignal(),
    });

    if (!response.ok) {
      return parseError(response);
    }

    return (await response.json()) as CustomerProfileMeResponse;
  };

/** PATCH /api/users/customers/profile */
export const upsertCustomerProfile = async (
  body: UpsertCustomerProfileRequest
): Promise<CustomerProfileResponse> => {
  const response = await authFetch(`${API_BASE_URL}${PROFILE_PATH}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: createApiTimeoutSignal(),
  });

  if (!response.ok) {
    return parseError(response);
  }

  return (await response.json()) as CustomerProfileResponse;
};
