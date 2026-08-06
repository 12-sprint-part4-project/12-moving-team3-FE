/** Top·작성 FAB 공통 우측 inset */
export const FLOATING_ACTION_INSET_X_CLASS =
  'right-4 min-[46.5rem]:right-16 xl:right-24';

/** Mobile Top·작성 FAB 하단 inset */
export const FLOATING_ACTION_BOTTOM_CLASS = 'bottom-6';

/** Mobile Top 버튼 위치 (우측 + 하단) */
export const FLOATING_ACTION_BASE_POSITION_CLASS = `${FLOATING_ACTION_INSET_X_CLASS} ${FLOATING_ACTION_BOTTOM_CLASS}`;

/** Top·작성 FAB 공통 크기 — Mobile 66px / Tablet·Desktop 79px */
export const FLOATING_ACTION_BUTTON_SIZE_CLASS =
  'size-[4.125rem] min-[46.5rem]:size-[4.95rem]';

/** Top·작성 FAB 공통 fixed 스타일 */
export const FLOATING_ACTION_FIXED_CLASS =
  'fixed z-40 flex shrink-0 cursor-pointer items-center justify-center rounded-3xl shadow-[0_4px_12px_rgba(0,0,0,0.18)]';

/** Top chevron — viewBox 여백 보정 */
export const SCROLL_TO_TOP_ICON_CLASS =
  'size-11 min-[46.5rem]:size-[3.25rem]';

/** 작성 FAB 아이콘 — 버튼 크기에 맞춤 */
export const WRITE_FAB_ICON_CLASS = 'size-9 min-[46.5rem]:size-11';

/** Tablet Top 버튼 하단 inset */
export const SCROLL_TO_TOP_TABLET_BOTTOM_CLASS = 'min-[46.5rem]:bottom-20';

/** Desktop Top 버튼 하단 inset */
export const SCROLL_TO_TOP_DESKTOP_BOTTOM_CLASS = 'xl:bottom-32';

/** 글쓰기 FAB — Top 버튼 위 (bottom + FLOATING_ACTION_BUTTON_SIZE + gap-3) */
export const WRITE_FAB_BOTTOM_CLASS =
  'bottom-[6.375rem] min-[46.5rem]:bottom-[10.7rem] xl:bottom-[13.7rem]';
