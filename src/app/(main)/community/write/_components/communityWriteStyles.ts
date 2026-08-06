import { getPostCategoryBadgeClassName } from '@/constants/communityCategoryStyles';
import type { PostCategory } from '@/types/community';

import { COMMUNITY_RICH_TEXT_PROSE_CLASS } from '../../_components/communitySharedStyles';

/** Figma 15211:41641 — 게시글 작성 Mobile / Tablet / Desktop 공통 스타일 */

/** 페이지 본문 영역 — 좌우는 layout 헤더와 동일(COMMUNITY_HEADER_X + COMMUNITY_DESKTOP_X) */
export const COMMUNITY_WRITE_MAIN_CLASS =
  'pb-10 pt-6 min-[46.5rem]:pt-8 xl:pt-10';

/** 페이지 제목 — Mobile 24 / Tablet 27 / Desktop 31 */
export const COMMUNITY_WRITE_PAGE_TITLE_CLASS =
  'text-lg-bold text-black-400 min-[46.5rem]:text-xl-bold xl:text-2xl-bold';

/** 섹션 라벨 — Mobile 12 / Tablet·Desktop 14–16 */
export const COMMUNITY_WRITE_LABEL_CLASS =
  'm-0 shrink-0 text-xs-semibold leading-5 text-black-400 min-[46.5rem]:text-sm-semibold min-[46.5rem]:leading-[1.375rem]';

/** 섹션 안내 문구 */
export const COMMUNITY_WRITE_HINT_CLASS =
  'm-0 text-xs-regular leading-5 text-gray-400 min-[46.5rem]:text-sm-regular min-[46.5rem]:leading-[1.375rem]';

/** 라벨 + 안내 문구 한 줄 — 상하 중앙 정렬 */
export const COMMUNITY_WRITE_LABEL_ROW_CLASS =
  'flex flex-wrap items-center gap-x-2 gap-y-0.5';

/** 칩·썸네일 행 */
export const COMMUNITY_WRITE_FIELD_ROW_CLASS = 'mt-2.5 flex flex-wrap gap-2';

/** 작성 칩 미선택 — 카테고리·지역 공통 (흰색 + 테두리) */
export const COMMUNITY_WRITE_CHIP_UNSELECTED_CLASS =
  'bg-white border border-line-200 text-gray-400';

/** 작성 페이지 지역 칩 — 선택 상태 */
export const COMMUNITY_WRITE_REGION_CHIP_SELECTED_CLASS =
  'bg-blue-100 text-blue-300';

/** 카테고리·지역 칩 공통 (지역 전용 레이아웃) */
export const COMMUNITY_WRITE_CHIP_BASE_CLASS =
  'inline-flex cursor-pointer items-center justify-center rounded px-1.5 py-0.5 shadow-[0_0.0625rem_0.125rem] shadow-shadow-gray-200/10';

/** text-sm — medium(500) / semibold(600) */
export const COMMUNITY_WRITE_CHIP_UNSELECTED_FONT_CLASS = 'text-sm-medium';
export const COMMUNITY_WRITE_CHIP_SELECTED_FONT_CLASS = 'text-sm-semibold';

/** 작성 카테고리 칩 — 선택 시 목록 뱃지와 동일 색상 */
export const getPostCategoryWriteChipClassName = (
  category: PostCategory,
  isSelected: boolean
): string => {
  if (!isSelected) {
    return `${COMMUNITY_WRITE_CHIP_UNSELECTED_CLASS} text-xs-medium`;
  }

  return getPostCategoryBadgeClassName(category);
};

/** 제목 입력 — h-48 */
export const COMMUNITY_WRITE_TITLE_INPUT_CLASS =
  'h-12 w-full rounded-lg border border-line-200 bg-white px-4 text-xs-medium text-black-400 outline-none placeholder:text-gray-400 min-[46.5rem]:text-sm-medium xl:text-md-regular';

/** 제목 입력 래퍼 — 라벨과 입력 간격은 다른 필드와 동일(mt-2.5) */
export const COMMUNITY_WRITE_TITLE_FIELD_WRAPPER_CLASS = 'relative mt-2.5';

/** 제목 글자 수 카운터 — 섹션 높이에 포함되지 않도록 입력 아래 absolute */
export const COMMUNITY_WRITE_TITLE_COUNTER_CLASS =
  'pointer-events-none absolute right-0 top-full m-0 mt-1 text-right text-xs-regular leading-5 text-gray-400 min-[46.5rem]:text-sm-regular min-[46.5rem]:leading-[1.375rem]';

/** 제목 글자 수 초과 경고 — 카운터 아래 absolute (초과 시에만 노출) */
export const COMMUNITY_WRITE_TITLE_ERROR_CLASS =
  'absolute right-0 top-full m-0 mt-6 text-right text-xs-medium leading-5 text-red-200 min-[46.5rem]:mt-7 min-[46.5rem]:text-sm-medium min-[46.5rem]:leading-[1.375rem]';

/** 본문 툴바 — 에디터 상단, 라운드 없이 연결 */
export const COMMUNITY_WRITE_TOOLBAR_CLASS =
  'flex h-11 items-center gap-4 border border-b-0 border-shadow-gray-200 bg-background-200 px-3 min-[46.5rem]:gap-5 xl:px-4';

/** 본문 툴바 버튼 — 시각 간격 유지, padding + negative margin으로 클릭 영역만 확장 */
export const COMMUNITY_WRITE_TOOLBAR_BUTTON_CLASS =
  'relative -mx-2 -my-1 cursor-pointer px-2 py-1 text-sm-semibold text-gray-400';

/** 본문 Tiptap ProseMirror — h-280 */
const COMMUNITY_WRITE_CONTENT_EDITOR_BASE_CLASS =
  'min-h-[17.5rem] w-full border border-shadow-gray-200 bg-white px-4 py-4 text-xs-medium text-black-400 outline-none min-[46.5rem]:text-sm-medium xl:text-md-regular';

const COMMUNITY_WRITE_CONTENT_EDITOR_PLACEHOLDER_CLASS =
  '[&_p.is-editor-empty:first-child]:before:pointer-events-none [&_p.is-editor-empty:first-child]:before:float-left [&_p.is-editor-empty:first-child]:before:h-0 [&_p.is-editor-empty:first-child]:before:text-gray-400 [&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]';

export const COMMUNITY_WRITE_CONTENT_EDITOR_CLASS = [
  COMMUNITY_WRITE_CONTENT_EDITOR_BASE_CLASS,
  COMMUNITY_RICH_TEXT_PROSE_CLASS,
  COMMUNITY_WRITE_CONTENT_EDITOR_PLACEHOLDER_CLASS,
].join(' ');

/** 이미지 추가 버튼 — 80×80 */
export const COMMUNITY_WRITE_IMAGE_ADD_BUTTON_CLASS =
  'inline-flex size-20 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-shadow-gray-200 bg-background-200 text-2xl-regular text-gray-400';

/** 이미지 썸네일 — 80×80 */
export const COMMUNITY_WRITE_IMAGE_THUMB_CLASS =
  'relative size-20 shrink-0 overflow-hidden rounded-lg border border-shadow-gray-200';

/** 취소 버튼 — Mobile·Tablet flex-1 / Desktop 120px */
export const COMMUNITY_WRITE_CANCEL_BUTTON_CLASS =
  'inline-flex h-12 flex-1 cursor-pointer items-center justify-center rounded-lg border border-shadow-gray-200 bg-background-200 text-sm-semibold text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300 min-[46.5rem]:text-sm-semibold xl:h-12 xl:w-[7.5rem] xl:flex-none xl:text-md-semibold';

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
