'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { ReviewListSection } from '@/components/reviews/ReviewListSection';
import { ReviewsEmptyState } from '@/components/reviews/ReviewsEmptyState';
import {
  REVIEW_HIGHLIGHT_DURATION_MS,
  REVIEWS_CONTENT_CLASS,
} from '@/components/reviews/ReviewsTabs';
import { WrittenReviewCard } from '@/components/reviews/WrittenReviewCard';
import { useCustomerReviews } from '@/hooks/useCustomerReviews';
import { resolveApiErrorMessage } from '@/lib/apiClient';

import { isReviewListEmpty } from '../_lib/isReviewListEmpty';

import type { CustomerReviewItem } from '@/types/review';

export interface WrittenReviewsPanelProps {
  enabled: boolean;
  highlightReviewId: number | null;
  onReviewClick: (item: CustomerReviewItem) => void;
}

/** `/reviews` 내가 작성한 리뷰 탭. Query·highlight·목록 가드. */
export const WrittenReviewsPanel = ({
  enabled,
  highlightReviewId,
  onReviewClick,
}: WrittenReviewsPanelProps) => {
  const router = useRouter();
  const highlightCardRef = useRef<HTMLButtonElement>(null);
  const highlightHandledRef = useRef<number | null>(null);

  const written = useCustomerReviews({ enabled });

  useEffect(() => {
    if (highlightReviewId === null) {
      highlightHandledRef.current = null;
      return;
    }

    if (
      written.isPending ||
      written.isError ||
      highlightHandledRef.current === highlightReviewId
    ) {
      return;
    }

    const isHighlightedReviewVisible = written.reviews.some(
      (review) => review.id === highlightReviewId
    );
    if (!isHighlightedReviewVisible) {
      return;
    }

    highlightHandledRef.current = highlightReviewId;

    highlightCardRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    const timer = window.setTimeout(() => {
      router.replace('/reviews?tab=written');
    }, REVIEW_HIGHLIGHT_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [
    highlightReviewId,
    router,
    written.isError,
    written.isPending,
    written.reviews,
  ]);

  return (
    <div className={REVIEWS_CONTENT_CLASS}>
      <ReviewListSection
        items={written.reviews}
        status={{
          isPending: written.isPending,
          isError: written.isError,
          showEmpty: isReviewListEmpty(written),
          pendingMessage: '작성한 리뷰를 불러오는 중...',
          errorMessage: resolveApiErrorMessage(
            written.error,
            '작성한 리뷰를 불러오지 못했습니다.'
          ),
          onRetry: () => {
            void written.refetch();
          },
          emptyState: (
            <ReviewsEmptyState message="아직 작성한 리뷰가 없어요" />
          ),
        }}
        pagination={{
          page: written.page,
          totalPages: written.totalPages,
          onPageChange: written.setPage,
          isFetching: written.isFetching,
          getItemKey: (item) => item.id,
        }}
        renderItem={(item) => {
          const highlighted = highlightReviewId === item.id;
          return (
            <WrittenReviewCard
              ref={highlighted ? highlightCardRef : undefined}
              item={item}
              highlighted={highlighted}
              onClick={onReviewClick}
            />
          );
        }}
      />
    </div>
  );
};
