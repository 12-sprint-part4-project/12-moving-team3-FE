/** Figma 15167:41689 — 게시글 상세 공통 스타일 */

import {
  COMMUNITY_DETAIL_DIVIDER,
  COMMUNITY_RICH_TEXT_PROSE_CLASS,
} from '../../../_components/communitySharedStyles';

export { COMMUNITY_DETAIL_DIVIDER };

/** 댓글 입력 */
export const COMMUNITY_DETAIL_COMMENT_INPUT =
  'h-11 min-w-0 flex-1 rounded-lg border border-shadow-gray-200 bg-background-200 px-4 text-sm-medium text-black-400 placeholder:text-gray-400 min-[46.5rem]:text-sm-medium xl:h-[3.625rem] xl:rounded-lg xl:px-5 xl:text-md-regular';

/** 메타 텍스트 공통 */
const COMMUNITY_DETAIL_META_BASE =
  'text-xs-regular text-gray-400 min-[46.5rem]:text-sm-medium xl:text-md-regular';

/** 메타 닉네임 */
export const COMMUNITY_DETAIL_META_NICKNAME = `${COMMUNITY_DETAIL_META_BASE} font-bold`;

/** 메타 날짜 */
export const COMMUNITY_DETAIL_META_DATE = COMMUNITY_DETAIL_META_BASE;

/** 게시글 메타 행 액션 — Mobile 20px / Tablet 24px / Desktop 28px */
export const COMMUNITY_POST_META_ACTION_BUTTON_CLASS =
  'inline-flex size-5 shrink-0 cursor-pointer items-center justify-center text-gray-400 transition-colors hover:text-black-400 min-[46.5rem]:size-6 xl:size-7';

export const COMMUNITY_POST_META_ACTION_ICON_CLASS =
  'size-5 shrink-0 min-[46.5rem]:size-6 xl:size-7';

/** 메타·공유 아이콘 그룹 간격 — Mobile 4px / Tablet·Desktop 8px */
export const COMMUNITY_POST_ICON_GROUP_GAP_CLASS = 'gap-1 min-[46.5rem]:gap-2';

/** 좋아요·공유 등 engagement 아이콘 버튼 — Tablet 44px / Desktop 58px */
export const COMMUNITY_ENGAGEMENT_BUTTON_CLASS =
  'inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl p-2.5 xl:size-[3.625rem]';

/** engagement 아이콘 — Tablet 24px / Desktop 36px */
export const COMMUNITY_ENGAGEMENT_ICON_CLASS = 'size-6 shrink-0 xl:size-9';

/** 공유 아이콘 — 18px */
export const COMMUNITY_SHARE_ICON_CLASS = 'size-[1.125rem] shrink-0';

/** 공유 버튼 — Tablet 33px / Desktop 40.5px */
export const COMMUNITY_SHARE_BUTTON_CLASS =
  'inline-flex size-[2.0625rem] shrink-0 cursor-pointer items-center justify-center rounded-xl p-1.5 xl:size-[2.53125rem] xl:rounded-2xl';

/** 본문 — 마크다운 (작성 에디터 prose와 동일 계열) */
export const COMMUNITY_DETAIL_BODY_MARKDOWN_CLASS = [
  'px-1.5 text-sm-medium text-black-400 min-[46.5rem]:text-md-regular xl:text-2lg-regular',
  COMMUNITY_RICH_TEXT_PROSE_CLASS,
  '[&_p+p]:mt-2',
].join(' ');

/** 댓글 행 간격 */
export const COMMUNITY_COMMENT_ROW_GAP_CLASS = 'gap-2 tablet:gap-3';

/** 대댓글 들여쓰기 */
export const COMMUNITY_COMMENT_REPLY_INDENT_CLASS =
  'pl-9 tablet:pl-12 xl:pl-[3.75rem]';

/** 작성자 뱃지 */
export const COMMUNITY_POST_AUTHOR_BADGE_CLASS =
  'inline-flex h-4 shrink-0 items-center justify-center rounded px-1 text-xs-semibold whitespace-nowrap bg-blue-300/12 text-blue-300 tablet:h-[1.125rem] tablet:rounded-md tablet:px-1.5 tablet:text-xs-semibold';

/** engagement 입력 바 간격 */
export const COMMUNITY_ENGAGEMENT_FORM_GAP_CLASS =
  'gap-[0.6875rem] tablet:gap-3 xl:gap-[1.0625rem]';

/** 더보기 메뉴 패널 */
export const COMMUNITY_POST_MORE_MENU_PANEL_CLASS =
  'absolute top-full right-0 z-50 mt-2 min-w-[8.75rem] overflow-hidden rounded-2xl border border-line-200 bg-white py-1.5 shadow-[0.125rem_0.125rem_0.25rem] shadow-shadow-gray-200/20';

/** 게시글 이미지 썸네일 버튼 */
export const COMMUNITY_POST_DETAIL_THUMB_BUTTON_CLASS =
  'size-[6.25rem] shrink-0 overflow-hidden rounded-lg bg-background-200 tablet:size-[12.5rem] tablet:rounded-xl xl:size-[18.75rem]';

/** 깨진 이미지 아이콘 */
export const COMMUNITY_POST_DETAIL_BROKEN_ICON_CLASS =
  'size-[1.5625rem] text-gray-200 tablet:size-[3.125rem] xl:size-[4.6875rem]';

/** 이미지 미리보기 패널 */
export const COMMUNITY_POST_IMAGE_PREVIEW_PANEL_CLASS =
  'relative max-w-[min(92vw,56.25rem)] bg-transparent shadow-none sm:max-w-[min(92vw,56.25rem)]';
