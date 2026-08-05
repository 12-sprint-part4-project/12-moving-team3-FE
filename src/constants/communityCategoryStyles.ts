import type { PostCategory } from '@/types/community';

/** Figma post-card 카테고리 뱃지 색상 (Mobile 15101:40892) */
export const POST_CATEGORY_STYLE: Record<
  PostCategory,
  { badgeClassName: string; labelClassName: string }
> = {
  MOVING_TIP: {
    badgeClassName: 'bg-blue-300/12',
    labelClassName: 'text-blue-300',
  },
  QUESTION: {
    badgeClassName: 'bg-[#f29900]/12',
    labelClassName: 'text-[#f29900]',
  },
  REVIEW: {
    badgeClassName: 'bg-[#33b266]/12',
    labelClassName: 'text-[#33b266]',
  },
  ETC: {
    badgeClassName: 'bg-gray-300/12',
    labelClassName: 'text-gray-400',
  },
  FURNITURE_SHARE: {
    badgeClassName: 'bg-blue-300/12',
    labelClassName: 'text-blue-300',
  },
};
