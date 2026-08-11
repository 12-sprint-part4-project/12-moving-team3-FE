/** Top·작성 FAB 공통 우측 inset */
export const FLOATING_ACTION_INSET_X_CLASS =
  'right-4 min-[46.5rem]:right-16 xl:right-24';

/** Top·작성 FAB 공통 크기 — Mobile·Tablet 44px / Desktop 58px */
export const FLOATING_ACTION_BUTTON_SIZE_CLASS = 'size-11 xl:size-[3.625rem]';

/** Top·작성 FAB 공통 아이콘 크기 */
export const FLOATING_ACTION_ICON_CLASS = 'size-6 xl:size-9';

/** Top·작성 FAB 공통 fixed 스타일 */
export const FLOATING_ACTION_FIXED_CLASS =
  'fixed z-40 flex shrink-0 cursor-pointer items-center justify-center rounded-2xl xl:rounded-3xl shadow-[0_4px_12px_rgba(0,0,0,0.18)]';

/** Tablet Top 버튼 하단 inset */
export const SCROLL_TO_TOP_TABLET_BOTTOM_CLASS = 'min-[46.5rem]:bottom-20';

/** Desktop Top 버튼 하단 inset */
export const SCROLL_TO_TOP_DESKTOP_BOTTOM_CLASS = 'xl:bottom-32';

/**
 * 글쓰기 FAB bottom — 스크롤 전(rest): Top 버튼 자리
 * Mobile bottom-6 / Tablet bottom-20 / Desktop bottom-32
 */
export const WRITE_FAB_REST_BOTTOM_CLASS =
  'bottom-6 min-[46.5rem]:bottom-20 xl:bottom-32';

/**
 * 글쓰기 FAB bottom — 스크롤 전(rest), 하단 고정 바 있는 상세 페이지
 * Mobile bottom-20 / Desktop bottom-32
 */
export const WRITE_FAB_REST_BOTTOM_RAISED_CLASS = 'bottom-20 xl:bottom-32';

/**
 * 글쓰기 FAB bottom — 스크롤 후: Top 버튼 위
 * Top normal(6/20/32) + 버튼 44px/58px + gap 12px
 */
export const WRITE_FAB_BOTTOM_CLASS =
  'bottom-20 min-[46.5rem]:bottom-[8.5rem] xl:bottom-[12.375rem]';

/**
 * 글쓰기 FAB bottom — 스크롤 후, 하단 고정 바 있는 상세 페이지
 * Top raised(20/20/32) + 버튼 44px/58px + gap 12px
 */
export const WRITE_FAB_BOTTOM_RAISED_CLASS =
  'bottom-[8.5rem] xl:bottom-[12.375rem]';
