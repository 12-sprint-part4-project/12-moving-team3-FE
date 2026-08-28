import { cn } from '@/lib/utils';

/**
 * 기사 견적(`/mover/quotes`)에서 반복 사용되는 클래스 상수.
 * 일회성 클래스는 각 컴포넌트에서 cn으로 인라인 작성.
 */

/** Mobile 24 / Tablet 72 / Desktop 40·64·260 */
export const MOVER_QUOTES_PAGE_X_PADDING =
  'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

/** 목록 본문 컨테이너 (패딩 포함) */
export const MOVER_QUOTES_CONTENT_CLASS = cn(
  'mx-auto w-full max-w-[1920px] py-6 md:py-8 lg:py-10',
  MOVER_QUOTES_PAGE_X_PADDING
);

/** `/mover/quotes` 탭 패널 래퍼 */
export const MOVER_QUOTES_TAB_PANEL_CLASS = 'flex min-h-0 flex-1 flex-col';

/** 상세 — 섹션 구분선 */
export const MOVER_QUOTE_DETAIL_DIVIDER_CLASS = 'h-px w-full bg-line-100';

/** 상세 — 섹션 래퍼 */
export const MOVER_QUOTE_DETAIL_SECTION_CLASS =
  'flex w-full flex-col gap-4 lg:gap-8';

/** 상세 — 섹션 제목 */
export const MOVER_QUOTE_DETAIL_SECTION_TITLE_CLASS =
  'text-lg-semibold text-black-400 lg:text-2xl-semibold';
