'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { ReviewListSection } from '@/components/reviews/ReviewListSection';
import {
  ReviewsContent,
  ReviewsListStatus,
} from '@/components/reviews/ReviewsListStatus';
import { REVIEW_HIGHLIGHT_DURATION_MS } from '@/components/reviews/ReviewsTabs';
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

/** `/reviews` 내가 작성한 리뷰 탭. Query·highlight·배타 가드. */
export const WrittenReviewsPanel = ({
  enabled,
  highlightReviewId,
  onReviewClick,
}: WrittenReviewsPanelProps) => {
  const router = useRouter();
  const highlightCardRef = useRef<HTMLButtonElement>(null);
  const highlightHandledRef = useRef<number | null>(null);

  const written = useCustomerReviews({ enabled });
  const items = written.reviews;

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

    const isHighlightedReviewVisible = items.some(
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
    items,
    router,
    written.isError,
    written.isPending,
  ]);

  // 로딩 — 초기 조회 (페이지 전환 keepPreviousData는 목록 오버레이)
  if (written.isPending && items.length === 0) {
    return (
      <ReviewsListStatus
        variant="pending"
        message="작성한 리뷰를 불러오는 중..."
      />
    );
  }

  // 에러 — 재시도
  if (written.isError) {
    return (
      <ReviewsListStatus
        variant="error"
        message={resolveApiErrorMessage(
          written.error,
          '작성한 리뷰를 불러오지 못했습니다.'
        )}
        onRetry={() => {
          void written.refetch();
        }}
      />
    );
  }

  // 빈 목록
  if (isReviewListEmpty(written)) {
    return (
      <ReviewsListStatus
        variant="empty"
        message="아직 작성한 리뷰가 없어요"
      />
    );
  }

  // 본문 — 그리드 + 페이지네이션
  return (
    <ReviewsContent>
      <ReviewListSection
        items={items}
        pagination={{
          page: written.page,
          totalPages: written.totalPages,
          onPageChange: written.setPage,
          isFetching: written.isFetching && !written.isPending,
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
    </ReviewsContent>
  );
};
