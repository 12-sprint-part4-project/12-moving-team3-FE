'use client';

import { Button } from '@/components/Button/Button';
import { CommunityPostListSkeleton } from '@/components/ui/Skeleton';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { cn } from '@/lib/utils';
import type { PostListContext } from '@/lib/communityListContext';
import type { PostListItem } from '@/types/community';

import { CommunityFurnitureGridCard } from './CommunityFurnitureGridCard';
import { CommunityPostCard } from './CommunityPostCard';
import { COMMUNITY_FURNITURE_GRID_CLASS } from './communityLayout';

type CommunityPostListVariant = 'list' | 'furniture-grid';

interface CommunityPostListProps {
  posts: PostListItem[];
  listContext?: PostListContext;
  variant?: CommunityPostListVariant;
  showSkeleton?: boolean;
  isError: boolean;
  isEmpty: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError?: boolean;
  errorMessage: string;
  emptyMessage: string;
  onRetry: () => void;
  onRetryNextPage?: () => void;
  loadMoreRef: (node?: Element | null) => void;
  className?: string;
  listClassName?: string;
}

/** 커뮤니티 게시글 목록 — 무한스크롤 sentinel 포함 */
export const CommunityPostList = ({
  posts,
  listContext,
  variant = 'list',
  showSkeleton = false,
  isError,
  isEmpty,
  isFetchingNextPage,
  isFetchNextPageError = false,
  errorMessage,
  emptyMessage,
  onRetry,
  onRetryNextPage,
  loadMoreRef,
  className = '',
  listClassName = 'flex flex-col gap-2 min-[46.5rem]:gap-8 xl:gap-12',
}: CommunityPostListProps) => {
  const isFurnitureGrid = variant === 'furniture-grid';
  const resolvedListClassName = isFurnitureGrid
    ? COMMUNITY_FURNITURE_GRID_CLASS
    : listClassName;

  const isInitialError = isError && posts.length === 0;
  const showEmpty = !showSkeleton && !isInitialError && isEmpty;
  const showPosts = !showSkeleton && !isInitialError && posts.length > 0;

  return (
    <div className={className}>
      {showSkeleton ? (
        <CommunityPostListSkeleton
          variant={variant}
          listClassName={resolvedListClassName}
        />
      ) : null}

      {isInitialError ? (
        <div className="flex flex-col items-center gap-4 py-16">
          <p className="text-center text-lg-medium text-gray-400">
            {errorMessage}
          </p>
          <Button variant="outlined" size="md" onClick={onRetry}>
            다시 시도
          </Button>
        </div>
      ) : null}

      {showEmpty ? (
        <p className="py-16 text-center text-lg-medium text-gray-400">
          {emptyMessage}
        </p>
      ) : null}

      {showPosts ? (
        <ul className={cn('list-none p-0 m-0', resolvedListClassName)}>
          {posts.map((post, index) => (
            <li key={post.id} className={isFurnitureGrid ? 'min-w-0' : undefined}>
              {isFurnitureGrid ? (
                <CommunityFurnitureGridCard
                  post={post}
                  listContext={listContext}
                  preload={index < 3}
                />
              ) : (
                <CommunityPostCard post={post} listContext={listContext} />
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {isFetchingNextPage ? (
        <div className="flex justify-center py-6">
          <Spinner message="더 불러오는 중..." className="py-6" />
        </div>
      ) : null}

      {!isFetchingNextPage && isFetchNextPageError ? (
        <div className="flex flex-col items-center gap-2 py-4">
          <p className="text-center text-md-medium text-gray-400">
            다음 게시글을 불러오지 못했습니다.
          </p>
          <button
            type="button"
            onClick={onRetryNextPage}
            className="cursor-pointer text-md-medium text-blue-300 underline-offset-2 hover:underline"
          >
            다시 시도
          </button>
        </div>
      ) : null}

      <div ref={loadMoreRef} className="h-8 w-full" aria-hidden />
    </div>
  );
};
