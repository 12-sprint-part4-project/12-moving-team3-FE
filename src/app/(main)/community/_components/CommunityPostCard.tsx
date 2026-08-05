import Link from 'next/link';

import { formatRelativeTime } from '@/lib/formatDate';
import {
  buildCommunityPostDetailHref,
  type PostListContext,
} from '@/lib/communityListContext';
import { cn } from '@/lib/utils';
import type { PostListItem } from '@/types/community';

import { CommunityCategoryBadge } from './CommunityCategoryBadge';
import { CommunityPostThumbnail } from './CommunityPostThumbnail';

interface CommunityPostCardProps {
  post: PostListItem;
  listContext?: PostListContext;
  className?: string;
}

const formatPostMeta = (post: PostListItem): string => {
  const relativeTime = formatRelativeTime(post.createdAt);

  return [
    post.author.nickname,
    `좋아요 ${post.likeCount}`,
    `댓글 ${post.commentCount}`,
    relativeTime,
  ].join(' · ');
};

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
        'relative flex h-[7.25rem] w-full overflow-hidden rounded-2xl bg-white p-3.5 shadow-request-card',
        'min-[46.5rem]:h-[7.5rem] min-[46.5rem]:px-5 min-[46.5rem]:py-4',
        'xl:h-[8.75rem] xl:p-6',
        className
      )}
    >
      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col',
          hasThumbnail && 'pr-3 min-[46.5rem]:pr-4 xl:pr-6'
        )}
      >
        <CommunityCategoryBadge category={post.category} />

        <h2
          className={cn(
            'mt-1.5 line-clamp-1 text-sm-semibold text-black-400',
            'min-[46.5rem]:mt-2 min-[46.5rem]:text-lg-semibold',
            'xl:mt-2 xl:text-2lg-semibold'
          )}
        >
          {post.title}
        </h2>

        <p
          className={cn(
            'mt-1 line-clamp-1 text-xs-regular text-gray-400',
            'min-[46.5rem]:text-sm-medium min-[46.5rem]:text-gray-500',
            'xl:mt-2 xl:text-md-regular xl:text-gray-500'
          )}
        >
          {post.contentPreview}
        </p>

        <p
          className={cn(
            'mt-auto line-clamp-1 text-xs-regular text-gray-300',
            'min-[46.5rem]:text-gray-400'
          )}
        >
          {formatPostMeta(post)}
        </p>

        {post.isCompleted ? (
          <span className="mt-1 inline-flex w-fit rounded bg-background-300 px-1.5 py-0.5 text-xs-medium text-gray-400">
            나눔 완료
          </span>
        ) : null}
      </div>

      {hasThumbnail ? (
        <CommunityPostThumbnail thumbnailUrl={thumbnailUrl} />
      ) : null}
    </Link>
  );
};
