/** Top 버튼을 숨기는 경로 — 로그인·회원가입·OAuth 콜백 */
const SCROLL_TO_TOP_EXCLUDED_PATHS = new Set([
  '/login',
  '/login/mover',
  '/signup',
  '/signup/mover',
  '/auth/kakao/callback',
]);

export const isScrollToTopVisible = (pathname: string): boolean =>
  !SCROLL_TO_TOP_EXCLUDED_PATHS.has(pathname);
