import {
  COMMUNITY_POST_BADGE_FONT_CLASS,
  COMMUNITY_POST_BADGE_ROW_CLASS,
} from '@/constants/communityCategoryStyles';
import { isCommunityRegion } from '@/constants/communityOptions';
import { cn } from '@/lib/utils';
import type { PostCategory, Region } from '@/types/community';

import { CommunityCategoryBadge } from './CommunityCategoryBadge';
import { CommunityRegionBadge } from './CommunityRegionBadge';

const resolvePostRegion = (region: Region | null): Region | null =>
  region !== null && isCommunityRegion(region) ? region : null;

interface CommunityPostBadgesProps {
  category: PostCategory;
  region: Region | null;
  fontClassName?: string;
  className?: string;
}

/** 게시글 카테고리·지역 뱃지 */
export const CommunityPostBadges = ({
  category,
  region,
  fontClassName = COMMUNITY_POST_BADGE_FONT_CLASS,
  className = '',
}: CommunityPostBadgesProps) => {
  const resolvedRegion = resolvePostRegion(region);

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
    </div>
  );
};
