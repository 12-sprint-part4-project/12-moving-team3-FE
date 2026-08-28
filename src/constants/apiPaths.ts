/** HTTP 엔드포인트. 서비스 함수에서 이 상수만 사용한다. */
export const API_PATH = {
  AUTH_LOGIN: '/api/auth/login',
  AUTH_SIGNUP: '/api/auth/signup',
  AUTH_KAKAO: '/api/auth/kakao',
  AUTH_REFRESH: '/api/auth/refresh',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_ME: '/api/auth/me',
  CUSTOMER_PROFILE: '/api/users/customers/profile',
  MOVER_PROFILE: '/api/users/movers/profile',
  MOVER_BASIC_INFO: '/api/users/movers/basic-info',
  PRESIGNED_UPLOAD_URL: '/api/presigned-upload-url',
} as const;
