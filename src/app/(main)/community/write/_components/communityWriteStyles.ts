/** Figma 15211:41821 — 게시글 작성 Mobile 공통 스타일 */

/** Mobile 좌우 26px — Figma x=26 */
export const COMMUNITY_WRITE_SECTION_X = 'px-[1.625rem]';

/** 섹션 라벨 — 12px semibold */
export const COMMUNITY_WRITE_LABEL_CLASS =
  'text-xs-semibold text-black-400';

/** 제목 입력 — h-48, bg-background-200 */
export const COMMUNITY_WRITE_TITLE_INPUT_CLASS =
  'h-12 w-full rounded-lg border border-shadow-gray-200 bg-background-200 px-4 text-xs-medium text-black-400 outline-none placeholder:text-gray-400';

/** 본문 툴바 — h-44 */
export const COMMUNITY_WRITE_TOOLBAR_CLASS =
  'flex h-11 items-center gap-4 rounded-lg border border-shadow-gray-200 bg-background-200 px-3';

/** 본문 textarea — h-280 */
export const COMMUNITY_WRITE_CONTENT_TEXTAREA_CLASS =
  'min-h-[17.5rem] w-full resize-none border border-shadow-gray-200 bg-white px-4 py-4 text-xs-medium text-black-400 outline-none placeholder:text-gray-400';

/** 이미지 추가 버튼 — 80×80 */
export const COMMUNITY_WRITE_IMAGE_ADD_BUTTON_CLASS =
  'inline-flex size-20 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-shadow-gray-200 bg-background-200 text-2xl-regular text-gray-400';

/** 취소 버튼 — outlined gray (Figma Mobile) */
export const COMMUNITY_WRITE_CANCEL_BUTTON_CLASS =
  'inline-flex h-12 flex-1 cursor-pointer items-center justify-center rounded-lg border border-shadow-gray-200 bg-background-200 text-sm-semibold text-gray-400';

/** 등록 버튼 — solid primary */
export const COMMUNITY_WRITE_SUBMIT_BUTTON_CLASS =
  'inline-flex h-12 flex-1 cursor-pointer items-center justify-center rounded-lg bg-blue-300 text-sm-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300';
