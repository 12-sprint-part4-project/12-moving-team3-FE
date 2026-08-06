import type { PostCategory } from '@/types/community';

/** Figma post-card 카테고리 뱃지 — blue-300은 댓글 「작성자」 칩 전용 */
export const POST_CATEGORY_STYLE: Record<
  PostCategory,
  { badgeClassName: string; labelClassName: string }
> = {
  MOVING_TIP: {
    badgeClassName: 'bg-yellow-100/12',
    labelClassName: 'text-yellow-100',
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

/** 작성 페이지 칩 — 카테고리·지역 공통 미선택 (흰색 + 테두리) */
export const COMMUNITY_WRITE_CHIP_UNSELECTED_CLASS =
  'bg-white border border-line-200 text-gray-400';

export const getPostCategoryChipClassName = (
  category: PostCategory,
  isSelected: boolean
): string => {
  if (!isSelected) {
    return COMMUNITY_WRITE_CHIP_UNSELECTED_CLASS;
  }

  const { badgeClassName, labelClassName } = POST_CATEGORY_STYLE[category];
  return `${badgeClassName} ${labelClassName}`;
};
