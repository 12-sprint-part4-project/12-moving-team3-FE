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
    badgeClassName: 'bg-gray-300/12',
    labelClassName: 'text-gray-400',
  },
  FURNITURE_SHARE: {
    badgeClassName: 'bg-yellow-100/12',
    labelClassName: 'text-yellow-100',
  },
};

/** 목록 뱃지·작성 카테고리 칩 공통 레이아웃 — Figma post-card 40×20 / 52×22 / 56×24 */
export const POST_CATEGORY_CHIP_LAYOUT_CLASS =
  'inline-flex h-5 w-fit min-w-10 shrink-0 items-center justify-center overflow-hidden rounded px-1.5 whitespace-nowrap text-xs-semibold min-[46.5rem]:h-[1.375rem] min-[46.5rem]:min-w-[3.25rem] min-[46.5rem]:rounded-md min-[46.5rem]:px-2 xl:h-6 xl:min-w-14 xl:rounded-md xl:px-2';

/** 목록 카테고리 뱃지 색상 */
export const getPostCategoryBadgeClassName = (
  category: PostCategory
): string => {
  const { badgeClassName, labelClassName } = POST_CATEGORY_STYLE[category];
  return `${badgeClassName} ${labelClassName}`;
};
