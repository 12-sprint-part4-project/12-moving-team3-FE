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
  phoneNumber: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthUser {
  id: string;
  userType: ApiUserType;
  nickname: string;
  email: string;
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

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}
