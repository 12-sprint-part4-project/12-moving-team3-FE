export type ApiUserType = 'CUSTOMER' | 'MOVER';

export interface LoginRequest {
  userType: ApiUserType;
  email: string;
  password: string;
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

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}
