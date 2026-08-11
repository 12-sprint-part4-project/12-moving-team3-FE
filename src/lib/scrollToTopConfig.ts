/** 완전히 숨기는 경로 (exact match) */
const SCROLL_TO_TOP_EXCLUDED_PATHS = new Set([
  '/login',
  '/login/mover',
  '/signup',
  '/signup/mover',
  '/auth/kakao/callback',
  '/community/write',
  '/estimates/request',
]);

/** 완전히 숨기는 경로 프리픽스 */
const SCROLL_TO_TOP_EXCLUDED_PREFIXES = ['/chat', '/profile'];

/**
 * 모바일에서 하단 고정 바 위로 버튼을 올려야 하는 경로 프리픽스
 * - /community/  → 게시글 상세 (CommunityPostEngagementBar ~68px)
 * - /quotes/     → 견적 상세 (CustomerQuoteDetailActions ~56px)
 * - /movers/     → 기사 상세 (MoverDetailBottomBar ~56px)
 */
const SCROLL_TO_TOP_RAISED_PREFIXES = ['/community/', '/quotes/', '/movers/'];

export interface ScrollToTopConfig {
  visible: boolean;
  /** 모바일 하단 inset 클래스 */
  mobileBottomClass: string;
}

export const getScrollToTopConfig = (pathname: string): ScrollToTopConfig => {
  if (
    SCROLL_TO_TOP_EXCLUDED_PATHS.has(pathname) ||
    SCROLL_TO_TOP_EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))
  ) {
    return { visible: false, mobileBottomClass: 'bottom-6' };
  }

  const raised = SCROLL_TO_TOP_RAISED_PREFIXES.some((p) =>
    pathname.startsWith(p)
  );

  return {
    visible: true,
    mobileBottomClass: raised ? 'bottom-20' : 'bottom-6',
  };
};
