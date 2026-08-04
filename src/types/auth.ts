export type ApiUserType = 'CUSTOMER' | 'MOVER';

export interface LoginRequest {
  userType: ApiUserType;
  email: string;
  password: string;
}

export interface SignupRequest {
  userType: ApiUserType;
  name: string;
  nickname: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthUser {
  id: string;
  userType: ApiUserType;
  nickname: string;
  email: string;
  /** 프로필 등록 전에는 빈 문자열 */
  phoneNumber: string;
  isProfileCompleted: boolean;
}

export interface LoginResponse {
  data: {
    user: AuthUser;
    accessToken: string;
  };
}

export interface SignupResponse {
  data: {
    user: AuthUser & {
      name: string;
      createdAt: string;
    };
    accessToken: string;
  };
}

export interface LogoutResponse {
  data: {
    message: string;
  };
}

export interface RefreshResponse {
  data: {
    accessToken: string;
  };
}

export interface KakaoLoginRequest {
  code: string;
  userType: ApiUserType;
}

export interface KakaoLoginResponse {
  data: {
    user: AuthUser;
    accessToken: string;
    isNewUser: boolean;
  };
}

export type { ApiErrorBody } from '@/types/api';
