'use client';

import { Button } from '@/components/Button/Button';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { cn } from '@/lib/utils';
import type { CommentWithReplies } from '@/types/community';

import { CommunityCommentItem } from './CommunityCommentItem';
import { COMMUNITY_DETAIL_DIVIDER } from './communityDetailStyles';

interface CommunityCommentListProps {
  comments: CommentWithReplies[];
  commentCount: number;
  isPending: boolean;
  isError: boolean;
  isEmpty: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError?: boolean;
  errorMessage: string;
  onRetry: () => void;
  onRetryNextPage?: () => void;
  loadMoreRef: (node?: Element | null) => void;
  className?: string;
}

/** 게시글 댓글 목록 — 무한스크롤 (Figma 15167:41692) */
export const CommunityCommentList = ({
  comments,
  commentCount,
  isPending,
  isError,
  isEmpty,
  isFetchingNextPage,
  isFetchNextPageError = false,
  errorMessage,
  onRetry,
  onRetryNextPage,
  loadMoreRef,
  className = '',
}: CommunityCommentListProps) => {
  const isInitialError = isError && comments.length === 0;
  const showEmpty = !isPending && !isInitialError && isEmpty;
  const showComments = !isPending && !isInitialError && comments.length > 0;

  return (
    <section className={className} aria-label="댓글">
      <h2 className="text-[0.8125rem] font-bold text-[#1a1a1a] min-[46.5rem]:text-[0.9375rem] xl:text-lg-bold">
        댓글 {commentCount}
      </h2>
      <div className={cn(COMMUNITY_DETAIL_DIVIDER, 'mt-3 min-[46.5rem]:mt-4')} />

      {isPending ? (
        <div className="flex justify-center py-10">
          <Spinner message="댓글 불러오는 중..." />
        </div>
      ) : null}

      {isInitialError ? (
        <div className="flex flex-col items-center gap-4 py-10">
          <p className="text-center text-md-medium text-gray-400">{errorMessage}</p>
          <Button variant="outlined" size="md" onClick={onRetry}>
            다시 시도
          </Button>
        </div>
      ) : null}

      {showEmpty ? (
        <p className="py-10 text-center text-md-medium text-gray-400">
          아직 댓글이 없어요.
        </p>
      ) : null}

      {showComments ? (
        <ul
          className={cn(
            'mt-6 flex flex-col gap-6',
            'min-[46.5rem]:mt-7 min-[46.5rem]:gap-7 xl:mt-8 xl:gap-8'
          )}
        >
          {comments.map((comment) => (
            <CommunityCommentItem key={comment.id} comment={comment} />
          ))}
        </ul>
      ) : null}

      {isFetchingNextPage ? (
        <div className="flex justify-center py-6">
          <Spinner message="댓글 더 불러오는 중..." className="py-6" />
        </div>
      ) : null}

      {!isFetchingNextPage && isFetchNextPageError ? (
        <div className="flex flex-col items-center gap-2 py-4">
          <p className="text-center text-md-medium text-gray-400">
            다음 댓글을 불러오지 못했습니다.
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

      <div ref={loadMoreRef} className="h-4 w-full" aria-hidden />
    </section>
  );
};
