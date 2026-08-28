/**
 * 고객 리뷰(`/reviews`)에서 반복되는 페이지 가로 패딩.
 * 일회성 클래스는 각 컴포넌트에서 cn으로 인라인 작성.
 */

/** Mobile 24 / Tablet 72 / Desktop 64·260 */
export const REVIEWS_PAGE_X_PADDING =
  'px-6 tablet:px-18 xl:px-16 min-[90rem]:px-65';

/** 탭 본문 컨테이너 — 패널 높이 채움(페이지네이션 mt-auto용) */
export const REVIEWS_CONTENT_CLASS = `mx-auto flex min-h-0 w-full max-w-[1920px] flex-1 flex-col py-6 tablet:py-8 xl:py-10 ${REVIEWS_PAGE_X_PADDING}`;

/** `/reviews` 탭 패널 래퍼 */
export const REVIEWS_TAB_PANEL_CLASS = 'flex min-h-0 flex-1 flex-col';
