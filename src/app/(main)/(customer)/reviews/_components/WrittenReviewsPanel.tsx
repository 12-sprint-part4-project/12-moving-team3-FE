'use client';

import { ReviewListSection } from '@/components/reviews/ReviewListSection';
import {
  ReviewsContent,
  ReviewsListStatus,
} from '@/components/reviews/ReviewsListStatus';
import { WrittenReviewCard } from '@/components/reviews/WrittenReviewCard';
import { useCustomerReviews } from '@/hooks/useCustomerReviews';
import { resolveApiErrorMessage } from '@/lib/apiClient';

import { isReviewListEmpty } from '../_lib/isReviewListEmpty';
import { useHighlightWrittenReview } from '../_lib/useHighlightWrittenReview';

import type { CustomerReviewItem } from '@/types/review';

export interface WrittenReviewsPanelProps {
  enabled: boolean;
  highlightReviewId: number | null;
  onReviewClick: (item: CustomerReviewItem) => void;
}

/** `/reviews` 내가 작성한 리뷰 탭. Query·배타 가드. */
export const WrittenReviewsPanel = ({
  enabled,
  highlightReviewId,
  onReviewClick,
}: WrittenReviewsPanelProps) => {
  const written = useCustomerReviews({ enabled });
  const items = written.reviews;
  const { cardRef, isHighlighted } = useHighlightWrittenReview({
    highlightReviewId,
    reviews: items,
    isPending: written.isPending,
    isError: written.isError,
  });

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
        renderItem={(item) => (
          <WrittenReviewCard
            ref={isHighlighted(item.id) ? cardRef : undefined}
            item={item}
            highlighted={isHighlighted(item.id)}
            onClick={onReviewClick}
          />
        )}
      />
    </ReviewsContent>
  );
};
