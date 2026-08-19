/**
 * `/movers` 목록·상세에서 반복되는 패딩·셸 클래스.
 * 일회성 클래스는 각 파일 JSX에 그대로 둔다.
 */

export const MOVERS_PAGE_X_PADDING =
  'px-6 tablet:px-[4.5rem] xl:px-16 min-[90rem]:px-[16.25rem]';

/** 목록 본문 그리드 (패딩 포함) */
export const MOVERS_LIST_CONTENT_CLASS = `mx-auto flex w-full max-w-[1920px] flex-col gap-6 py-6 tablet:py-8 xl:flex-row xl:items-start xl:gap-8 min-[90rem]:gap-12 ${MOVERS_PAGE_X_PADDING}`;

/** 상세 본문 그리드 (패딩 포함) */
export const MOVERS_DETAIL_CONTENT_CLASS = `mx-auto flex w-full max-w-[1920px] flex-col gap-0 py-6 tablet:py-8 xl:flex-row xl:items-start xl:gap-[7.6875rem] xl:py-9 ${MOVERS_PAGE_X_PADDING}`;

/** 상세 모바일·태블릿 하단바 — 페이지 x-padding과 다름 (tablet까지 72px, xl에서 숨김) */
export const MOVERS_DETAIL_BOTTOM_BAR_CLASS =
  'fixed inset-x-0 bottom-0 z-40 border-t border-line-100 bg-white px-6 py-2.5 tablet:px-[4.5rem] xl:hidden';
