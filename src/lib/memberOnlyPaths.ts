/**
 * 정지(SUSPENDED) 계정 접근 제한 경로.
 * BE requireAuth → 403 USER_SUSPENDED 대상과 맞춤.
 * (프로필·알림·채팅 목록/미읽음·공개 조회는 허용)
 */

/** 고객 — 견적/매칭·찜·리뷰 */
export const SUSPENDED_CUSTOMER_RESTRICTED_PREFIXES = [
  '/favorites',
  '/reviews',
  '/estimates/request',
  '/quotes',
] as const;

/** 기사 — 견적 업무 */
export const SUSPENDED_MOVER_RESTRICTED_PREFIXES = [
  '/mover/requests',
  '/mover/quotes',
] as const;

/** 공용 — 커뮤니티 쓰기 (채팅 방 상세는 별도 판별) */
export const SUSPENDED_SHARED_RESTRICTED_PREFIXES = [
  '/community/write',
] as const;

const matchesPrefix = (pathname: string, prefix: string): boolean =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

/** 정지 안내 페이지 (`/suspended`). 로그인된 SUSPENDED 계정만 본다. */
export const isSuspendedPagePath = (pathname: string): boolean =>
  matchesPrefix(pathname, '/suspended');

/**
 * 정지 계정이면 /suspended 로 보낼 경로인지.
 * `/chat` 목록은 허용, `/chat/:roomId` 방 상세는 제한.
 */
export const isSuspendedRestrictedPath = (pathname: string): boolean => {
  if (
    [
      ...SUSPENDED_CUSTOMER_RESTRICTED_PREFIXES,
      ...SUSPENDED_MOVER_RESTRICTED_PREFIXES,
      ...SUSPENDED_SHARED_RESTRICTED_PREFIXES,
    ].some((prefix) => matchesPrefix(pathname, prefix))
  ) {
    return true;
  }

  return pathname.startsWith('/chat/');
};

/** @deprecated isSuspendedRestrictedPath 사용 */
export const isMemberOnlyPath = isSuspendedRestrictedPath;
