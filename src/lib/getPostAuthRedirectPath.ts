import type { AuthUser } from '@/types/auth';

/**
 * open redirect 방지 — 앱 내부 상대 경로만 허용
 */
export const getSafeRedirectPath = (
  candidate: string | null | undefined
): string | null => {
  if (candidate == null || candidate === '') {
    return null;
  }

  if (!candidate.startsWith('/') || candidate.startsWith('//')) {
    return null;
  }

  return candidate;
};

/**
 * 로그인·소셜 인증 후 이동 경로.
 * 프로필 미등록 고객 → /profile/customer
 * 프로필 미등록 기사 → /profile/mover
 * redirect 쿼리가 유효하면 해당 경로
 * 그 외(정지 포함) → /
 */
export const getPostAuthRedirectPath = (
  user: AuthUser,
  options?: { redirectTo?: string | null }
): string => {
  if (!user.isProfileCompleted) {
    if (user.userType === 'CUSTOMER') {
      return '/profile/customer';
    }
    if (user.userType === 'MOVER') {
      return '/profile/mover';
    }
  }

  return getSafeRedirectPath(options?.redirectTo) ?? '/';
};
