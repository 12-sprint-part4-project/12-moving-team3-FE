import type { AuthUser } from '@/types/auth';

/**
 * 로그인·회원가입 성공 후 이동 경로.
 * 일반유저 프로필 미등록이면 프로필 등록 페이지로 보낸다.
 */
export const getPostAuthRedirectPath = (user: AuthUser): string => {
  if (user.userType === 'CUSTOMER' && !user.isProfileCompleted) {
    return '/profile/customer';
  }

  return '/';
};
