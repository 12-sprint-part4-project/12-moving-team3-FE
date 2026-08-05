import { POST_CATEGORY_LABEL } from '@/constants/communityOptions';
import { POST_CATEGORY_STYLE } from '@/constants/communityCategoryStyles';
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
}: CommunityCategoryBadgeProps) => {
  const style = POST_CATEGORY_STYLE[category];

  return (
    <span
      className={cn(
        'inline-flex h-5 w-fit min-w-10 shrink-0 items-center justify-center overflow-hidden rounded px-1.5 text-xs-semibold whitespace-nowrap',
        'min-[46.5rem]:h-[1.375rem] min-[46.5rem]:min-w-[3.25rem] min-[46.5rem]:rounded-md min-[46.5rem]:px-2',
        'xl:h-6 xl:min-w-14 xl:rounded-md xl:px-2',
        style.badgeClassName,
        style.labelClassName,
        className
      )}
    >
      {POST_CATEGORY_LABEL[category]}
    </span>
  );
};
