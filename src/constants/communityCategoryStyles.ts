import type { PostCategory } from '@/types/community';

/** Figma post-card 카테고리 뱃지 */
export const POST_CATEGORY_STYLE: Record<
  PostCategory,
  { badgeClassName: string; labelClassName: string }
> = {
  MOVING_TIP: {
    badgeClassName: 'bg-blue-300/12',
    labelClassName: 'text-blue-300',
  },
  QUESTION: {
    badgeClassName: 'bg-orange-300/12',
    labelClassName: 'text-orange-300',
  },
  REVIEW: {
    badgeClassName: 'bg-green-300/12',
    labelClassName: 'text-green-300',
  },
  ETC: {
    badgeClassName: 'bg-gray-500/12',
    labelClassName: 'text-gray-500',
  },
  FURNITURE_SHARE: {
    badgeClassName: 'bg-yellow-100/12',
    labelClassName: 'text-yellow-100',
  },
};

/** 목록 뱃지·작성 카테고리 칩 공통 레이아웃 — Figma post-card 40×20 / 52×22 / 56×24 */
export const POST_CATEGORY_CHIP_LAYOUT_CLASS =
  'inline-flex h-5 w-fit min-w-10 shrink-0 items-center justify-center overflow-hidden rounded px-1.5 whitespace-nowrap text-xs-semibold min-[46.5rem]:h-[1.375rem] min-[46.5rem]:min-w-[3.25rem] min-[46.5rem]:rounded-md min-[46.5rem]:px-2 xl:h-6 xl:min-w-14 xl:rounded-md xl:px-2';

/** 목록·상세 지역 뱃지 — 기존 ETC(기타) 색상 */
export const POST_REGION_BADGE_CLASS = 'bg-gray-300/12 text-gray-400';

/** 사진 위 지역 뱃지 — 가구나눔 그리드 등 overlay (반투명 파란 배경 + 흰색 텍스트) */
export const POST_REGION_OVERLAY_BADGE_CLASS = 'bg-[rgba(14,165,233,0.72)] text-white shadow-sm';

/** 사진 위 지역 칩 레이아웃 — 게시판 카테고리 칩과 동일 */
export const POST_REGION_OVERLAY_CHIP_LAYOUT_CLASS = POST_CATEGORY_CHIP_LAYOUT_CLASS;

/** 목록·상세 카테고리·지역 뱃지 공통 타이포 */
export const COMMUNITY_POST_BADGE_FONT_CLASS =
  'text-md-semibold min-[46.5rem]:text-lg-semibold xl:text-2lg-semibold';

/** 목록 카드 뱃지 — COMMUNITY_POST_BADGE_FONT_CLASS보다 한 단계 작게 */
export const COMMUNITY_POST_LIST_BADGE_FONT_CLASS =
  'text-sm-semibold min-[46.5rem]:text-md-semibold xl:text-lg-semibold';

/** 목록·상세 카테고리·지역 뱃지 행 레이아웃 */
export const COMMUNITY_POST_BADGE_ROW_CLASS =
  'flex flex-wrap items-center gap-1.5 min-[46.5rem]:gap-2';

/** 목록 카테고리 뱃지 색상 */
export const getPostCategoryBadgeClassName = (
  category: PostCategory
): string => {
  const { badgeClassName, labelClassName } = POST_CATEGORY_STYLE[category];
  return `${badgeClassName} ${labelClassName}`;
};
