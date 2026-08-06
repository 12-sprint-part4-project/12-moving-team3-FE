import Link from 'next/link';

import NoImageIcon from '@/assets/icons/no-image.svg';
import { COMMUNITY_POST_LIST_BADGE_FONT_CLASS } from '@/constants/communityCategoryStyles';
import { isCommunityRegion } from '@/constants/communityOptions';
import {
  buildCommunityPostDetailHref,
  type PostListContext,
} from '@/lib/communityListContext';
import { cn } from '@/lib/utils';
import type { PostListItem } from '@/types/community';

import { CommunityPostThumbnail } from './CommunityPostThumbnail';
import { CommunityRegionBadge } from './CommunityRegionBadge';

interface CommunityFurnitureGridCardProps {
  post: PostListItem;
  listContext?: PostListContext;
  className?: string;
}

const GRID_THUMBNAIL_CLASS =
  '!size-auto aspect-square w-full shrink rounded-none bg-background-200 min-[46.5rem]:!size-auto xl:!size-auto';

/** 가구나눔 사진첩 그리드 카드 */
export const CommunityFurnitureGridCard = ({
  post,
  listContext,
  className = '',
}: CommunityFurnitureGridCardProps) => {
  const thumbnailUrl = post.thumbnailUrl;
  const hasThumbnail = thumbnailUrl !== null;
  const region =
    post.region !== null && isCommunityRegion(post.region) ? post.region : null;

  return (
    <Link
      href={buildCommunityPostDetailHref(post.id, listContext)}
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl bg-white shadow-request-card',
        className
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-background-200">
        {hasThumbnail ? (
          <CommunityPostThumbnail
            thumbnailUrl={thumbnailUrl}
            className={GRID_THUMBNAIL_CLASS}
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <NoImageIcon
              className="size-8 text-gray-200 min-[46.5rem]:size-10 xl:size-12"
              aria-hidden
            />
          </div>
        )}

        {region ? (
          <div className="absolute top-2 left-2 min-[46.5rem]:top-2.5 min-[46.5rem]:left-2.5 xl:top-3 xl:left-3">
            <CommunityRegionBadge
              region={region}
              className={COMMUNITY_POST_LIST_BADGE_FONT_CLASS}
            />
          </div>
        ) : null}

        {post.isCompleted ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black-400/40">
            <span className="rounded-lg bg-white/90 px-2.5 py-1 text-sm-semibold text-gray-500 min-[46.5rem]:px-3 min-[46.5rem]:py-1.5 min-[46.5rem]:text-md-semibold">
              나눔 완료
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col gap-0.5 px-2.5 py-2 min-[46.5rem]:gap-1 min-[46.5rem]:px-3 min-[46.5rem]:py-2.5 xl:px-3.5 xl:py-3">
        <h2
          className={cn(
            'truncate text-md-semibold text-black-400',
            'min-[46.5rem]:text-lg-semibold xl:text-xl-semibold'
          )}
        >
          {post.title}
        </h2>
        <p className="truncate text-xs-regular text-gray-400 min-[46.5rem]:text-md-regular">
          {post.author.nickname}
        </p>
      </div>
    </Link>
  );
};
