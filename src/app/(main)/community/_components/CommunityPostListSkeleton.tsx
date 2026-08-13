import { cn } from '@/lib/utils';

import { COMMUNITY_FURNITURE_GRID_CLASS } from './communityLayout';

type CommunityPostListSkeletonVariant = 'list' | 'furniture-grid';

interface CommunityPostListSkeletonProps {
  variant?: CommunityPostListSkeletonVariant;
  className?: string;
  listClassName?: string;
}

const LIST_SKELETON_COUNT = 4;
const FURNITURE_GRID_SKELETON_COUNT = 6;

const ListCardSkeleton = () => (
  <div
    className={cn(
      'flex min-h-[8.25rem] w-full overflow-hidden rounded-2xl bg-white p-3.5 shadow-request-card',
      'min-[46.5rem]:min-h-[8.75rem] min-[46.5rem]:px-5 min-[46.5rem]:py-4',
      'xl:min-h-[10rem] xl:p-6'
    )}
    aria-hidden
  >
    <div className="flex min-w-0 flex-1 flex-col pr-3 min-[46.5rem]:pr-4 xl:pr-6">
      <div className="h-5 w-16 animate-pulse rounded bg-background-200 min-[46.5rem]:h-6 min-[46.5rem]:w-20" />
      <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-background-200 min-[46.5rem]:mt-2.5 min-[46.5rem]:h-6" />
      <div className="mt-1.5 h-4 w-full animate-pulse rounded bg-background-200 min-[46.5rem]:mt-2 min-[46.5rem]:h-5" />
      <div className="mt-auto flex gap-3 pt-2 min-[46.5rem]:gap-4 min-[46.5rem]:pt-3">
        <div className="h-4 w-12 animate-pulse rounded bg-background-200" />
        <div className="h-4 w-10 animate-pulse rounded bg-background-200" />
        <div className="h-4 w-10 animate-pulse rounded bg-background-200" />
      </div>
    </div>
    <div
      className={cn(
        'size-[4.5rem] shrink-0 animate-pulse rounded-lg bg-background-200',
        'min-[46.5rem]:h-[5.5rem] min-[46.5rem]:w-[5.25rem]',
        'xl:h-[6.25rem] xl:w-[6.75rem]'
      )}
    />
  </div>
);

const FurnitureGridCardSkeleton = () => (
  <div
    className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-request-card"
    aria-hidden
  >
    <div className="aspect-square w-full animate-pulse bg-background-200" />
    <div className="flex flex-col gap-0.5 px-2.5 py-2 min-[46.5rem]:gap-1 min-[46.5rem]:px-3 min-[46.5rem]:py-2.5 xl:px-3.5 xl:py-3">
      <div className="h-6 w-4/5 animate-pulse rounded bg-background-200 min-[46.5rem]:h-[1.625rem] xl:h-8" />
      <div className="h-[1.125rem] w-1/3 animate-pulse rounded bg-background-200 min-[46.5rem]:h-6" />
    </div>
  </div>
);

/** 커뮤니티 게시글 목록 로딩 스켈레톤 */
export const CommunityPostListSkeleton = ({
  variant = 'list',
  className = '',
  listClassName = 'flex flex-col gap-2 min-[46.5rem]:gap-8 xl:gap-12',
}: CommunityPostListSkeletonProps) => {
  const isFurnitureGrid = variant === 'furniture-grid';
  const count = isFurnitureGrid
    ? FURNITURE_GRID_SKELETON_COUNT
    : LIST_SKELETON_COUNT;
  const resolvedListClassName = isFurnitureGrid
    ? COMMUNITY_FURNITURE_GRID_CLASS
    : listClassName;

  return (
    <div
      className={className}
      role="status"
      aria-busy="true"
      aria-label="게시글 불러오는 중"
    >
      <ul className={cn('list-none p-0 m-0', resolvedListClassName)}>
        {Array.from({ length: count }, (_, index) => (
          <li key={index} className={isFurnitureGrid ? 'min-w-0' : undefined}>
            {isFurnitureGrid ? (
              <FurnitureGridCardSkeleton />
            ) : (
              <ListCardSkeleton />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
