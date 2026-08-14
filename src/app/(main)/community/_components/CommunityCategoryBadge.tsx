import {
  getPostCategoryBadgeClassName,
  POST_CATEGORY_CHIP_LAYOUT_CLASS,
} from '@/constants/communityCategoryStyles';
import { POST_CATEGORY_LABEL } from '@/constants/communityOptions';
import { cn } from '@/lib/utils';

import type { PostCategory } from '@/types/community';

interface CommunityCategoryBadgeProps {
  category: PostCategory;
  className?: string;
}

/** Figma post-card 카테고리 뱃지 — Mobile 40×20 / Tablet 52×22 / Desktop 56×24 */
export const CommunityCategoryBadge = ({
  category,
  className = '',
}: CommunityCategoryBadgeProps) => (
  <span
    className={cn(
      POST_CATEGORY_CHIP_LAYOUT_CLASS,
      getPostCategoryBadgeClassName(category),
      className
    )}
  >
    {POST_CATEGORY_LABEL[category]}
  </span>
);
