import {
  API_BASE_URL,
  ApiError,
  createApiTimeoutSignal,
  throwApiError,
} from '@/lib/apiClient';
import { authFetch } from '@/lib/authFetch';
import type {
  CustomerProfileMe,
  CustomerProfileMeResponse,
  CustomerProfileResponse,
  CustomerRegion,
  CustomerServiceType,
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

/**
 * 본인 프로필 data 조회.
 * 미등록(404)이면 null을 반환한다.
 */
export const getCustomerProfileMe =
  async (): Promise<CustomerProfileMe | null> => {
    try {
      const response = await getCustomerProfile();
      return response.data;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
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

export interface UpdateCustomerProfileParams {
  name: string;
  nickname: string;
  phoneNumber: string;
  region?: CustomerRegion | null;
  service?: CustomerServiceType[];
  currentPassword?: string;
  newPassword?: string;
  newPasswordConfirm?: string;
  s3Key?: string;
}

/** 프로필 수정 요청 body 조립 후 PATCH */
export const updateCustomerProfile = async (
  params: UpdateCustomerProfileParams
): Promise<CustomerProfileResponse> => {
  const body: UpsertCustomerProfileRequest = {
    name: params.name,
    nickname: params.nickname.trim(),
    phoneNumber: params.phoneNumber.replace(/\D/g, ''),
    ...(params.region ? { region: params.region } : {}),
    ...(params.service && params.service.length > 0
      ? { service: params.service }
      : {}),
    ...(params.newPassword
      ? {
          currentPassword: params.currentPassword,
          newPassword: params.newPassword,
          newPasswordConfirm: params.newPasswordConfirm,
        }
      : {}),
    ...(params.s3Key ? { s3Key: params.s3Key } : {}),
  };

  return upsertCustomerProfile(body);
};
