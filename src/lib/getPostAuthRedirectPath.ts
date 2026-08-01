import type { AuthUser } from '@/types/auth';

/** 프로필 미등록 고객은 /profile/customer 로 보냄 */
export const getPostAuthRedirectPath = (user: AuthUser): string => {
  if (user.userType === 'CUSTOMER' && !user.isProfileCompleted) {
    return '/profile/customer';
  }

  return '/';
};
