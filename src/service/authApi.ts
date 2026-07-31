import { apiClient } from '@/lib/apiClient';
import type { LoginRequest, LoginResponse } from '@/types/auth';

/** POST /api/auth/login */
export const login = (body: LoginRequest): Promise<LoginResponse> => {
  return apiClient<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body,
  });
};
