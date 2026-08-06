/**
 * 역할별·공용 회원 전용 경로.
 * - guest / SUSPENDED: 아래 경로 접근 불가 (공개 둘러보기만)
 * - ACTIVE customer / mover: 본인 역할 + 공용 경로
 */

/** 고객(CUSTOMER) 전용 */
export const CUSTOMER_ONLY_PATH_PREFIXES = [
  '/favorites',
  '/reviews',
  '/estimates/request',
  '/quotes',
  '/profile/customer',
] as const;

/** 기사(MOVER) 전용 */
export const MOVER_ONLY_PATH_PREFIXES = [
  '/mover/requests',
  '/mover/quotes',
  '/mover/mypage',
  '/profile/mover',
] as const;

/** 로그인 회원 공용 (고객·기사 공통) */
export const SHARED_MEMBER_PATH_PREFIXES = [
  '/chat',
  '/community/write',
] as const;

const matchesPrefix = (pathname: string, prefix: string): boolean =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

/** guest·SUSPENDED가 막혀야 하는 전체 회원 전용 경로 */
export const isMemberOnlyPath = (pathname: string): boolean =>
  [
    ...CUSTOMER_ONLY_PATH_PREFIXES,
    ...MOVER_ONLY_PATH_PREFIXES,
    ...SHARED_MEMBER_PATH_PREFIXES,
  ].some((prefix) => matchesPrefix(pathname, prefix));
