'use client';

import { Button } from '@/components/Button/Button';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { cn } from '@/lib/utils';
import type { PostListItem } from '@/types/community';

import { CommunityPostCard } from './CommunityPostCard';

interface CommunityPostListProps {
  posts: PostListItem[];
  isPending: boolean;
  isError: boolean;
  isEmpty: boolean;
  isFetchingNextPage: boolean;
  errorMessage: string;
  emptyMessage: string;
  onRetry: () => void;
  loadMoreRef: (node?: Element | null) => void;
  className?: string;
  listClassName?: string;
}

/** 커뮤니티 게시글 목록 — 무한스크롤 sentinel 포함 */
export const CommunityPostList = ({
  posts,
  isPending,
  isError,
  isEmpty,
  isFetchingNextPage,
  errorMessage,
  emptyMessage,
  onRetry,
  loadMoreRef,
  className = '',
  listClassName = 'flex flex-col gap-2 min-[46.5rem]:gap-8 xl:gap-12',
}: CommunityPostListProps) => {
  const showEmpty = !isPending && !isError && isEmpty;

  return (
    <div className={className}>
      {isPending ? (
        <div className="flex justify-center py-16">
          <Spinner message="게시글 불러오는 중..." />
        </div>
      ) : null}

      {isError ? (
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

      {!isPending && !isError && posts.length > 0 ? (
        <ul className={cn(listClassName)}>
          {posts.map((post) => (
            <li key={post.id}>
              <CommunityPostCard post={post} />
            </li>
          ))}
        </ul>
      ) : null}

      {isFetchingNextPage ? (
        <div className="flex justify-center py-6">
          <Spinner message="더 불러오는 중..." className="py-6" />
        </div>
      ) : null}

      <div ref={loadMoreRef} className="h-8 w-full" aria-hidden />
    </div>
  );
};
