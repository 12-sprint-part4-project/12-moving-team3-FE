import {
  COMMUNITY_POST_BADGE_FONT_CLASS,
  COMMUNITY_POST_BADGE_ROW_CLASS,
} from '@/constants/communityCategoryStyles';
import { isCommunityRegion, isFurnitureSharePost } from '@/constants/communityOptions';
import { cn } from '@/lib/utils';
import type { PostCategory, Region } from '@/types/community';

import { CommunityCategoryBadge } from './CommunityCategoryBadge';
import { CommunityFurnitureShareCompletedBadge } from './CommunityFurnitureShareCompletedBadge';
import { CommunityRegionBadge } from './CommunityRegionBadge';

const resolvePostRegion = (region: Region | null): Region | null =>
  region !== null && isCommunityRegion(region) ? region : null;

interface CommunityPostBadgesProps {
  category: PostCategory;
  region: Region | null;
  isCompleted?: boolean | null;
  fontClassName?: string;
  className?: string;
}

/** 게시글 카테고리·지역·나눔 완료 뱃지 */
export const CommunityPostBadges = ({
  category,
  region,
  isCompleted = null,
  fontClassName = COMMUNITY_POST_BADGE_FONT_CLASS,
  className = '',
}: CommunityPostBadgesProps) => {
  const resolvedRegion = resolvePostRegion(region);
  const showCompletedBadge =
    isFurnitureSharePost(category) && isCompleted === true;

  return (
    <div className={cn(COMMUNITY_POST_BADGE_ROW_CLASS, className)}>
      <CommunityCategoryBadge
        category={category}
        className={fontClassName}
      />
      {resolvedRegion ? (
        <CommunityRegionBadge
          region={resolvedRegion}
          className={fontClassName}
        />
      ) : null}
      {showCompletedBadge ? (
        <CommunityFurnitureShareCompletedBadge />
      ) : null}
    </div>
  );
};
