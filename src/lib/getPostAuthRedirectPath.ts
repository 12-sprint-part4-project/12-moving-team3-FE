import type { AuthUser } from '@/types/auth';

/**
 * 로그인·소셜 인증 후 이동 경로.
 * 프로필 미등록 고객 → /profile/customer
 * 프로필 미등록 기사 → /profile/mover
 * 그 외(정지 포함) → /
 */
export const getPostAuthRedirectPath = (user: AuthUser): string => {
  if (!user.isProfileCompleted) {
    if (user.userType === 'CUSTOMER') {
      return '/profile/customer';
    }
    if (user.userType === 'MOVER') {
      return '/profile/mover';
    }
  }

  return '/';
};
