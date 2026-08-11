import Link from 'next/link';
import type { ReactNode } from 'react';

import ChatIcon from '@/assets/icons/chat.svg';
import HeartIcon from '@/assets/icons/heart.svg';
import { COMMUNITY_POST_LIST_BADGE_FONT_CLASS } from '@/constants/communityCategoryStyles';
import { formatRelativeTime } from '@/lib/formatDate';
import { stripCommunityPostContent } from '@/lib/communityPostContent';
import {
  buildCommunityPostDetailHref,
  type PostListContext,
} from '@/lib/communityListContext';
import { cn } from '@/lib/utils';
import type { PostListItem } from '@/types/community';

import { CommunityPostBadges } from './CommunityPostBadges';
import { CommunityFurnitureShareCompletedBadge } from './CommunityFurnitureShareCompletedBadge';
import { CommunityPostThumbnail } from './CommunityPostThumbnail';

interface CommunityPostCardProps {
  post: PostListItem;
  listContext?: PostListContext;
  className?: string;
}

const META_COMMENT_ICON_CLASS =
  'size-4 shrink-0 text-gray-300 min-[46.5rem]:size-[1.125rem] xl:size-[1.3125rem]';

const META_LIKE_ICON_CLASS =
  'size-[0.91875rem] shrink-0 text-gray-300 min-[46.5rem]:size-[1.05rem] xl:size-[1.18125rem]';

const META_TEXT_CLASS =
  'mt-auto shrink-0 pt-1 text-md-regular text-gray-300 min-[46.5rem]:pt-1.5 min-[46.5rem]:text-lg-regular min-[46.5rem]:text-gray-400 xl:pt-2 xl:text-2lg-regular';

interface PostCardMetaStatProps {
  label: string;
  value: number;
  icon: ReactNode;
  className?: string;
}

const PostCardMetaStat = ({
  label,
  value,
  icon,
  className = '',
}: PostCardMetaStatProps) => (
  <span
    className={cn(
      'inline-flex shrink-0 items-center gap-1.5 min-[46.5rem]:gap-2',
      className
    )}
    aria-label={`${label} ${value}`}
  >
    {icon}
    <span aria-hidden>{value}</span>
  </span>
);

/** Figma post-card — Mobile 343×116 / Tablet 600×120 / Desktop 955×140 */
export const CommunityPostCard = ({
  post,
  listContext,
  className = '',
}: CommunityPostCardProps) => {
  const thumbnailUrl = post.thumbnailUrl;
  const hasThumbnail = thumbnailUrl !== null;

  return (
    <Link
      href={buildCommunityPostDetailHref(post.id, listContext)}
      className={cn(
        'relative flex min-h-[8.25rem] w-full overflow-hidden rounded-2xl bg-white p-3.5 shadow-request-card',
        'min-[46.5rem]:min-h-[8.75rem] min-[46.5rem]:px-5 min-[46.5rem]:py-4',
        'xl:min-h-[10rem] xl:p-6',
        className
      )}
    >
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col',
          hasThumbnail && 'pr-3 min-[46.5rem]:pr-4 xl:pr-6'
        )}
      >
        <CommunityPostBadges
          category={post.category}
          region={post.region}
          fontClassName={COMMUNITY_POST_LIST_BADGE_FONT_CLASS}
        />

        <h2
          className={cn(
            'mt-1 shrink-0 truncate text-lg-semibold text-black-400',
            'min-[46.5rem]:mt-1.5 min-[46.5rem]:text-xl-semibold',
            'xl:mt-2 xl:text-2xl-semibold'
          )}
        >
          {post.title}
        </h2>

        <p
          className={cn(
            'mt-0.5 shrink-0 truncate text-md-regular text-gray-400',
            'min-[46.5rem]:mt-1 min-[46.5rem]:text-lg-medium min-[46.5rem]:text-gray-500',
            'xl:mt-1.5 xl:text-2lg-regular xl:text-gray-500'
          )}
        >
          {stripCommunityPostContent(post.contentPreview)}
        </p>

        <div
          className={cn(
            META_TEXT_CLASS,
            'flex min-w-0 items-center gap-x-3 min-[46.5rem]:gap-x-[1.125rem]'
          )}
        >
          <span className="min-w-0 truncate">{post.author.nickname}</span>
          <PostCardMetaStat
            label="좋아요"
            value={post.likeCount}
            icon={<HeartIcon className={META_LIKE_ICON_CLASS} aria-hidden />}
          />
          <PostCardMetaStat
            label="댓글"
            value={post.commentCount}
            className="gap-0.5 min-[46.5rem]:gap-1"
            icon={<ChatIcon className={META_COMMENT_ICON_CLASS} aria-hidden />}
          />
          <time className="shrink-0" dateTime={post.createdAt}>
            {formatRelativeTime(post.createdAt)}
          </time>
        </div>

        {post.isCompleted === true ? (
          <CommunityFurnitureShareCompletedBadge className="mt-1" />
        ) : null}
      </div>

      {hasThumbnail ? (
        <CommunityPostThumbnail thumbnailUrl={thumbnailUrl} />
      ) : null}
    </Link>
  );
};
