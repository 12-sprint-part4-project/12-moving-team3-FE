'use client';

import { Button } from '@/components/Button/Button';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import { CommunityCommentItem } from './CommunityCommentItem';
import { COMMUNITY_DETAIL_DIVIDER } from './communityDetailStyles';

import type { CommentWithReplies } from '@/types/community';
import type { ReactNode } from 'react';

interface CommunityCommentListProps {
  comments: CommentWithReplies[];
  commentCount: number;
  postAuthorId?: string;
  currentUserId?: string;
  deletingCommentId?: number | null;
  onDeleteRequest?: (commentId: number) => void;
  onReplySubmit?: (commentId: number, content: string) => void;
  onLoginRequired?: () => void;
  isPending: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError?: boolean;
  errorMessage: string;
  onRetry: () => void;
  onRetryNextPage?: () => void;
  loadMoreRef: (node?: Element | null) => void;
  /** 본문과 댓글 헤더 사이 슬롯 (가구나눔 채팅 CTA 등) */
  beforeHeader?: ReactNode;
  headerAction?: ReactNode;
  className?: string;
}

/** 게시글 댓글 목록 — 무한스크롤 (Figma 15167:41692) */
export const CommunityCommentList = ({
  comments,
  commentCount,
  postAuthorId,
  currentUserId,
  deletingCommentId = null,
  onDeleteRequest,
  onReplySubmit,
  onLoginRequired,
  isPending,
  isError,
  isFetchingNextPage,
  isFetchNextPageError = false,
  errorMessage,
  onRetry,
  onRetryNextPage,
  loadMoreRef,
  beforeHeader,
  headerAction,
  className = '',
}: CommunityCommentListProps) => {
  const { t } = useTranslation();
  const isInitialError = isError && comments.length === 0;
  const showEmpty = !isPending && !isInitialError && comments.length === 0;
  const showComments = !isPending && !isInitialError && comments.length > 0;

  const commentAreaPadding = 'pt-6 min-[46.5rem]:pt-7 xl:pt-8';

  return (
    <section className={className} aria-label={t('community.commentsAria')}>
      {beforeHeader ? (
        <div className="mb-10 min-[46.5rem]:mb-12 xl:mb-16">{beforeHeader}</div>
      ) : null}

      <div className="flex items-end justify-between gap-3">
        <h2 className="text-lg-semibold text-black-400 min-[46.5rem]:text-2lg-regular xl:text-xl-bold">
          {t('community.commentCount', { count: commentCount })}
        </h2>
        {headerAction ? (
          <div className="shrink-0 self-start">{headerAction}</div>
        ) : null}
      </div>
      <div
        className={cn(COMMUNITY_DETAIL_DIVIDER, 'mt-1 min-[46.5rem]:mt-1.5')}
      />

      <div className={commentAreaPadding}>
        {isPending ? (
          <div className="flex justify-center">
            <Spinner message={t('community.loadingComments')} />
          </div>
        ) : null}

        {isInitialError ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-2lg-medium text-gray-400">
              {errorMessage}
            </p>
            <Button variant="outlined" size="md" onClick={onRetry}>
              {t('common.retry')}
            </Button>
          </div>
        ) : null}

        {showEmpty ? (
          <p className="text-center text-md-regular text-gray-400 min-[46.5rem]:text-lg-regular xl:text-2lg-regular">
            {t('community.emptyComments')}
          </p>
        ) : null}

        {showComments ? (
          <ul
            className={cn(
              'flex flex-col gap-6',
              'min-[46.5rem]:gap-7 xl:gap-8'
            )}
          >
            {comments.map((comment) => (
              <CommunityCommentItem
                key={comment.id}
                comment={comment}
                postAuthorId={postAuthorId}
                currentUserId={currentUserId}
                deletingCommentId={deletingCommentId}
                onDeleteRequest={onDeleteRequest}
                onReplySubmit={onReplySubmit}
                onLoginRequired={onLoginRequired}
              />
            ))}
          </ul>
        ) : null}

        {isFetchingNextPage ? (
          <div className="flex justify-center pt-6">
            <Spinner
              message={t('community.loadingMoreComments')}
              className="py-6"
            />
          </div>
        ) : null}

        {!isFetchingNextPage && isFetchNextPageError ? (
          <div className="flex flex-col items-center gap-2 pt-4">
            <p className="text-center text-2lg-medium text-gray-400">
              {t('community.nextCommentsError')}
            </p>
            {onRetryNextPage ? (
              <button
                type="button"
                onClick={onRetryNextPage}
                className="cursor-pointer text-2lg-medium text-blue-300 underline-offset-2 hover:underline"
              >
                {t('common.retry')}
              </button>
            ) : null}
          </div>
        ) : null}

        <div ref={loadMoreRef} className="h-0 w-full" aria-hidden />
      </div>
    </section>
  );
};
