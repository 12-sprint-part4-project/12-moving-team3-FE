import { apiClient } from '@/lib/apiClient';
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  SignupRequest,
  SignupResponse,
} from '@/types/auth';

/** POST /api/auth/login */
export const login = (body: LoginRequest): Promise<LoginResponse> => {
  return apiClient<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body,
  });
};

/** POST /api/auth/signup */
export const signup = (body: SignupRequest): Promise<SignupResponse> => {
  return apiClient<SignupResponse>('/api/auth/signup', {
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
