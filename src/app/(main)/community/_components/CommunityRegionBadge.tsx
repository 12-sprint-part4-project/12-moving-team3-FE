import { REGION_LABEL } from '@/constants/communityOptions';
import {
  POST_CATEGORY_CHIP_LAYOUT_CLASS,
  POST_REGION_BADGE_CLASS,
} from '@/constants/communityCategoryStyles';
import { cn } from '@/lib/utils';
import type { Region } from '@/types/community';

interface CommunityRegionBadgeProps {
  region: Region;
  className?: string;
}

/** Figma post-card 지역 뱃지 */
export const CommunityRegionBadge = ({
  region,
  className = '',
}: CommunityRegionBadgeProps) => (
  <span
    className={cn(
      POST_CATEGORY_CHIP_LAYOUT_CLASS,
      POST_REGION_BADGE_CLASS,
      className
    )}
  >
    {REGION_LABEL[region]}
  </span>
);
