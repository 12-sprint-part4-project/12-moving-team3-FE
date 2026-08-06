/** Figma 15211:41641 — 게시글 작성 Mobile / Tablet / Desktop 공통 스타일 */

/** 페이지 본문 영역 — 좌우는 layout 헤더와 동일(COMMUNITY_HEADER_X + COMMUNITY_DESKTOP_X) */
export const COMMUNITY_WRITE_MAIN_CLASS =
  'pb-10 pt-6 min-[46.5rem]:pt-8 xl:pt-10';

/** 페이지 제목 — Mobile 24 / Tablet 27 / Desktop 31 */
export const COMMUNITY_WRITE_PAGE_TITLE_CLASS =
  'text-lg-bold text-black-400 min-[46.5rem]:text-xl-bold xl:text-2xl-bold';

/** 섹션 라벨 — Mobile 12 / Tablet·Desktop 14–16 */
export const COMMUNITY_WRITE_LABEL_CLASS =
  'text-xs-semibold text-black-400 min-[46.5rem]:text-sm-semibold';

/** 섹션 안내 문구 */
export const COMMUNITY_WRITE_HINT_CLASS =
  'text-xs-regular text-gray-400 min-[46.5rem]:text-sm-regular';

/** 카테고리·지역 칩 공통 */
export const COMMUNITY_WRITE_CHIP_BASE_CLASS =
  'inline-flex cursor-pointer items-center justify-center rounded px-1.5 py-0.5 shadow-[0_0.0625rem_0.125rem] shadow-shadow-gray-200/10';

/** text-sm — medium(500) / semibold(600) */
export const COMMUNITY_WRITE_CHIP_UNSELECTED_FONT_CLASS = 'text-sm-medium';
export const COMMUNITY_WRITE_CHIP_SELECTED_FONT_CLASS = 'text-sm-semibold';

/** 제목 입력 — h-48 */
export const COMMUNITY_WRITE_TITLE_INPUT_CLASS =
  'h-12 w-full rounded-lg border border-line-200 bg-white px-4 text-xs-medium text-black-400 outline-none placeholder:text-gray-400 min-[46.5rem]:text-sm-medium xl:text-md-regular';

/** 본문 툴바 — h-44 */
export const COMMUNITY_WRITE_TOOLBAR_CLASS =
  'flex h-11 items-center gap-4 rounded-lg border border-shadow-gray-200 bg-background-200 px-3 min-[46.5rem]:gap-5 xl:px-4';

/** 본문 textarea — h-280 */
export const COMMUNITY_WRITE_CONTENT_TEXTAREA_CLASS =
  'min-h-[17.5rem] w-full resize-none border border-shadow-gray-200 bg-white px-4 py-4 text-xs-medium text-black-400 outline-none placeholder:text-gray-400 min-[46.5rem]:text-sm-medium xl:text-md-regular';

/** 이미지 추가 버튼 — 80×80 */
export const COMMUNITY_WRITE_IMAGE_ADD_BUTTON_CLASS =
  'inline-flex size-20 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-shadow-gray-200 bg-background-200 text-2xl-regular text-gray-400';

/** 이미지 썸네일 — 80×80 */
export const COMMUNITY_WRITE_IMAGE_THUMB_CLASS =
  'relative size-20 shrink-0 overflow-hidden rounded-lg border border-shadow-gray-200';

/** 취소 버튼 — Mobile·Tablet flex-1 / Desktop 120px */
export const COMMUNITY_WRITE_CANCEL_BUTTON_CLASS =
  'inline-flex h-12 flex-1 cursor-pointer items-center justify-center rounded-lg border border-shadow-gray-200 bg-background-200 text-sm-semibold text-gray-400 min-[46.5rem]:text-sm-semibold xl:h-12 xl:w-[7.5rem] xl:flex-none xl:text-md-semibold';

/** 등록 버튼 — Mobile·Tablet flex-1 / Desktop 120px */
export const COMMUNITY_WRITE_SUBMIT_BUTTON_CLASS =
  'inline-flex h-12 flex-1 cursor-pointer items-center justify-center rounded-lg bg-blue-300 text-sm-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300 min-[46.5rem]:text-sm-semibold xl:h-12 xl:w-[7.5rem] xl:flex-none xl:text-md-semibold';

/** 액션 버튼 영역 — Desktop 우측 정렬 */
export const COMMUNITY_WRITE_ACTIONS_CLASS =
  'flex gap-2 min-[46.5rem]:gap-2 xl:justify-end';

/** 폼 섹션 간격 */
export const COMMUNITY_WRITE_FORM_GAP_CLASS =
  'mt-6 flex flex-col gap-6 min-[46.5rem]:gap-6 xl:gap-6';

/** 헤더 구분선 상단 여백 */
export const COMMUNITY_WRITE_HEADER_DIVIDER_MT_CLASS =
  'mt-4 min-[46.5rem]:mt-5 xl:mt-6';
