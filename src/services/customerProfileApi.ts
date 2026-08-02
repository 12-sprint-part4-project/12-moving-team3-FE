import {
  API_BASE_URL,
  createApiTimeoutSignal,
  throwApiError,
} from '@/lib/apiClient';
import { authFetch } from '@/lib/authFetch';
import type {
  CustomerProfileMeResponse,
  CustomerProfileResponse,
  UpsertCustomerProfileRequest,
} from '@/types/customerProfile';

const PROFILE_PATH = '/api/users/customers/profile';

/** GET /api/users/customers/profile */
export const getCustomerProfile =
  async (): Promise<CustomerProfileMeResponse> => {
    const response = await authFetch(`${API_BASE_URL}${PROFILE_PATH}`, {
      method: 'GET',
      signal: createApiTimeoutSignal(),
    });

    if (!response.ok) {
      return throwApiError(response);
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
    return throwApiError(response);
  }

  return (await response.json()) as CustomerProfileResponse;
};
