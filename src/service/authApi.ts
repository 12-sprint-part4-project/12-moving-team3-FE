import { apiClient } from '@/lib/apiClient';
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
} from '@/types/auth';

/** POST /api/auth/login */
export const login = (body: LoginRequest): Promise<LoginResponse> => {
  return apiClient<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body,
  });
};

/** POST /api/auth/logout */
export const logout = (): Promise<LogoutResponse> => {
  return apiClient<LogoutResponse>('/api/auth/logout', {
    method: 'POST',
  });
};
