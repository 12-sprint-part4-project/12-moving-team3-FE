import { apiClient } from '@/lib/apiClient';
import type {
  KakaoLoginRequest,
  KakaoLoginResponse,
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

/**
 * POST /api/auth/kakao
 * 인가 코드(code) + userType을 BE로 전달한다.
 * Refresh Token은 httpOnly 쿠키로 내려오므로 credentials: include가 필요하다.
 */
export const kakaoLogin = (
  body: KakaoLoginRequest
): Promise<KakaoLoginResponse> => {
  return apiClient<KakaoLoginResponse>('/api/auth/kakao', {
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
