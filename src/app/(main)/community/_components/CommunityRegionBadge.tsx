import {
  POST_CATEGORY_CHIP_LAYOUT_CLASS,
  POST_REGION_BADGE_CLASS,
  POST_REGION_OVERLAY_BADGE_CLASS,
  POST_REGION_OVERLAY_CHIP_LAYOUT_CLASS,
} from '@/constants/communityCategoryStyles';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import type { Region } from '@/types/community';

type CommunityRegionBadgeVariant = 'default' | 'overlay';

interface CommunityRegionBadgeProps {
  region: Region;
  variant?: CommunityRegionBadgeVariant;
  className?: string;
}

/** Figma post-card 지역 뱃지 */
export const CommunityRegionBadge = ({
  region,
  variant = 'default',
  className = '',
}: CommunityRegionBadgeProps) => {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        variant === 'overlay'
          ? POST_REGION_OVERLAY_CHIP_LAYOUT_CLASS
          : POST_CATEGORY_CHIP_LAYOUT_CLASS,
        variant === 'overlay'
          ? POST_REGION_OVERLAY_BADGE_CLASS
          : POST_REGION_BADGE_CLASS,
        className
      )}
    >
      {t(`region.${region}`)}
    </span>
  );
};
