'use client';

import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import { CommunityListCardSkeleton } from './CommunityListCardSkeleton';
import { FurnitureGridCardSkeleton } from './FurnitureGridCardSkeleton';

type CommunityPostListSkeletonVariant = 'list' | 'furniture-grid';

interface CommunityPostListSkeletonProps {
  variant?: CommunityPostListSkeletonVariant;
  className?: string;
  listClassName?: string;
}

const LIST_SKELETON_COUNT = 4;
const FURNITURE_GRID_SKELETON_COUNT = 6;

/** 커뮤니티 게시글 목록 로딩 스켈레톤 */
export const CommunityPostListSkeleton = ({
  variant = 'list',
  className = '',
  listClassName = 'flex flex-col gap-2 min-[46.5rem]:gap-8 xl:gap-12',
}: CommunityPostListSkeletonProps) => {
  const { t } = useTranslation();
  const isFurnitureGrid = variant === 'furniture-grid';
  const count = isFurnitureGrid
    ? FURNITURE_GRID_SKELETON_COUNT
    : LIST_SKELETON_COUNT;

  return (
    <div
      className={className}
      role="status"
      aria-busy="true"
      aria-label={t('a11y.skeleton.communityPosts')}
    >
      <ul className={cn('list-none p-0 m-0', listClassName)}>
        {Array.from({ length: count }, (_, index) => (
          <li key={index} className={isFurnitureGrid ? 'min-w-0' : undefined}>
            {isFurnitureGrid ? (
              <FurnitureGridCardSkeleton />
            ) : (
              <CommunityListCardSkeleton />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
