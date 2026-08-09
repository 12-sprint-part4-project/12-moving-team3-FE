import type { ApiUserType } from '@/types/auth';

/**
 * 로그인 없이 접근 가능한 경로 prefix.
 */
export const PUBLIC_PATH_PREFIXES = [
  '/movers',
  '/community',
  '/login',
  '/signup',
  '/auth',
  '/suspended',
] as const;

/** 일반 유저(CUSTOMER) 전용 경로 prefix */
export const CUSTOMER_ONLY_PATH_PREFIXES = [
  '/favorites',
  '/reviews',
  '/estimates/request',
  '/quotes',
  '/profile/customer',
] as const;

/** 기사님(MOVER) 전용 경로 prefix — `/movers`(공개)와 구분 */
export const MOVER_ONLY_PATH_PREFIXES = [
  '/mover/requests',
  '/mover/quotes',
  '/mover/mypage',
  '/profile/mover',
] as const;

/** 역할 무관, 로그인만 필요 (고객·기사 모두 허용) */
export const AUTH_SHARED_PATH_PREFIXES = ['/chat', '/community/write'] as const;

export type AuthRouteRequirement =
  | { kind: 'public' }
  | { kind: 'shared' }
  | { kind: 'role'; requiredUserType: ApiUserType };

const matchesPrefix = (pathname: string, prefix: string): boolean =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

/** 공개 경로 여부 (`/` 포함) */
export const isPublicPath = (pathname: string): boolean => {
  if (pathname === '/') {
    return true;
  }

  return PUBLIC_PATH_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));
};

/** 일반 유저 전용 경로 여부 */
export const isCustomerOnlyPath = (pathname: string): boolean =>
  CUSTOMER_ONLY_PATH_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));

/** 기사님 전용 경로 여부 */
export const isMoverOnlyPath = (pathname: string): boolean =>
  MOVER_ONLY_PATH_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));

/** 역할 무관 인증 필요 경로 여부 */
export const isAuthSharedPath = (pathname: string): boolean =>
  AUTH_SHARED_PATH_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));

/**
 * 경로별 인증 요구사항.
 * - public: 비로그인 허용
 * - shared: 로그인만 필요 (CUSTOMER | MOVER)
 * - role: 특정 userType 필요
 */
export const getAuthRouteRequirement = (
  pathname: string
): AuthRouteRequirement => {
  if (isAuthSharedPath(pathname)) {
    return { kind: 'shared' };
  }

  if (isPublicPath(pathname)) {
    return { kind: 'public' };
  }

  if (isMoverOnlyPath(pathname)) {
    return { kind: 'role', requiredUserType: 'MOVER' };
  }

  if (isCustomerOnlyPath(pathname)) {
    return { kind: 'role', requiredUserType: 'CUSTOMER' };
  }

  return { kind: 'public' };
};

export const LOGIN_HREF_BY_USER_TYPE: Record<ApiUserType, string> = {
  CUSTOMER: '/login',
  MOVER: '/login/mover',
};
