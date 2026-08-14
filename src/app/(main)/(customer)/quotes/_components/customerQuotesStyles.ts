/**
 * 고객 견적(`/quotes`)에서 반복 사용되는 클래스 상수.
 * 일회성 클래스는 각 컴포넌트에서 cn으로 인라인 작성.
 */

/** Mobile 24 / Tablet 72 / Desktop 40·64·260 */
export const CUSTOMER_QUOTES_PAGE_X_PADDING =
  'px-6 md:px-18 lg:px-10 xl:px-16 min-[90rem]:px-65';

/** 목록·이용 내역 본문 컨테이너 (패딩 포함) */
export const CUSTOMER_QUOTES_CONTENT_CLASS = `mx-auto w-full max-w-[1920px] py-6 md:py-8 lg:py-10 ${CUSTOMER_QUOTES_PAGE_X_PADDING}`;

/** `/quotes` 탭 패널 래퍼 */
export const CUSTOMER_QUOTES_TAB_PANEL_CLASS = 'flex min-h-0 flex-1 flex-col';

/** 상세 — 섹션 구분선 */
export const CUSTOMER_QUOTE_DETAIL_DIVIDER_CLASS = 'h-px w-full bg-line-100';

/** 상세 — 섹션 래퍼 */
export const CUSTOMER_QUOTE_DETAIL_SECTION_CLASS =
  'flex w-full flex-col gap-4 lg:gap-8';

/** 상세 — 섹션 제목 */
export const CUSTOMER_QUOTE_DETAIL_SECTION_TITLE_CLASS =
  'text-lg-semibold text-black-400 lg:text-2xl-semibold';

/** 대기 카드 — InfoField 라벨 */
export const PENDING_QUOTE_FIELD_LABEL_CLASS =
  'px-1.5 py-0.5 text-md-medium text-gray-400 lg:py-1 lg:text-2lg-regular lg:text-gray-500';

/** 대기 카드 — InfoField 값 */
export const PENDING_QUOTE_FIELD_VALUE_CLASS =
  'text-md-medium text-black-300 lg:text-2lg-medium';

/** 대기 카드 — CTA 버튼 */
export const PENDING_QUOTE_CTA_CLASS =
  'h-12 min-w-0 flex-1 rounded-lg text-lg-semibold lg:h-16 lg:rounded-2xl lg:text-xl-semibold';

/** 이용 내역 카드 — CTA 버튼 */
export const HISTORY_QUOTE_CTA_CLASS =
  'h-12 w-full rounded-lg text-lg-semibold md:flex-1 lg:h-14 lg:rounded-2xl lg:text-xl-semibold';
