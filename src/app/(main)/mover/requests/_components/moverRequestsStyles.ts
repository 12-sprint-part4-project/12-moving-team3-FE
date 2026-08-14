import { cn } from '@/lib/utils';

/**
 * 기사 받은 요청(`/mover/requests`)에서 반복 사용되는 클래스 상수.
 */

/** Mobile 24 / Tablet 72 / Desktop 40·64·260 */
export const MOVER_REQUESTS_PAGE_X_PADDING =
  'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

/** 사이드 필터 + 목록 본문 레이아웃 */
export const MOVER_REQUESTS_LAYOUT_CLASS = cn(
  'mx-auto flex w-full max-w-[1920px] flex-col gap-6 py-6 md:py-8 xl:flex-row xl:items-start xl:gap-8 min-[90rem]:gap-12',
  MOVER_REQUESTS_PAGE_X_PADDING
);
