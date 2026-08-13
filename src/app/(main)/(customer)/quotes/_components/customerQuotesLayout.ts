/** 목록·이용 내역 바깥 셸 */
export const CUSTOMER_QUOTES_PAGE_SHELL_CLASS =
  'flex min-h-0 w-full flex-1 flex-col overflow-x-hidden';

/** 상세 바깥 셸 */
export const CUSTOMER_QUOTE_DETAIL_PAGE_SHELL_CLASS =
  'flex min-h-full w-full flex-col overflow-x-hidden bg-white';

/** Mobile 24px / Tablet 72px / Desktop 40px */
export const CUSTOMER_QUOTES_SECTION_X = 'px-6 md:px-18 lg:px-10';

/** Desktop 64px / 260px */
export const CUSTOMER_QUOTES_DESKTOP_X = 'xl:px-16 min-[90rem]:px-65';

/** 목록·이용 내역 좌우 패딩. SECTION_X + DESKTOP_X */
export const CUSTOMER_QUOTES_PAGE_X_PADDING = `${CUSTOMER_QUOTES_SECTION_X} ${CUSTOMER_QUOTES_DESKTOP_X}`;

/** 상세 Mobile 24px / Tablet 72px / Desktop 40px */
export const CUSTOMER_QUOTE_DETAIL_SECTION_X =
  'px-6 md:px-[4.5rem] lg:px-10';

/** 상세 Desktop 64px / 260px */
export const CUSTOMER_QUOTE_DETAIL_DESKTOP_X =
  'xl:px-16 min-[90rem]:px-[16.25rem]';

/** 상세 좌우 패딩. SECTION_X + DESKTOP_X */
export const CUSTOMER_QUOTE_DETAIL_PAGE_X_PADDING = `${CUSTOMER_QUOTE_DETAIL_SECTION_X} ${CUSTOMER_QUOTE_DETAIL_DESKTOP_X}`;

/** 페이지 타이틀 헤더 — 이용 내역·상세 */
export const CUSTOMER_QUOTES_TITLE_HEADER_CLASS =
  'border-b border-line-100 bg-white py-4 shadow-page-title md:py-6 lg:py-8';

/** 페이지 타이틀 텍스트 */
export const CUSTOMER_QUOTES_TITLE_CLASS =
  'text-2lg-semibold text-black-400 lg:text-2xl-semibold';

/** 목록·이용 내역 본문 컨테이너 */
export const CUSTOMER_QUOTES_CONTENT_CLASS = `mx-auto w-full max-w-[1920px] py-6 md:py-8 lg:py-10 ${CUSTOMER_QUOTES_PAGE_X_PADDING}`;

/** 상세 모바일 하단 CTA 여백 */
export const CUSTOMER_QUOTE_DETAIL_MOBILE_ACTION_PAD =
  'pb-[4.625rem] lg:pb-0';
