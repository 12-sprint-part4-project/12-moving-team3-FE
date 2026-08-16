'use client';

import { ReviewListSection } from '@/components/reviews/ReviewListSection';
import {
  ReviewsContent,
  ReviewsListStatus,
} from '@/components/reviews/ReviewsListStatus';
import { WritableReviewCard } from '@/components/reviews/WritableReviewCard';
import { useCustomerWritableQuotes } from '@/hooks/useCustomerWritableQuotes';
import { resolveApiErrorMessage } from '@/lib/apiClient';

import { isReviewListEmpty } from '../_lib/isReviewListEmpty';

import type { WritableQuoteItem } from '@/types/review';

export interface WritableReviewsPanelProps {
  enabled: boolean;
  onWriteClick: (item: WritableQuoteItem) => void;
}

/** `/reviews` 작성 가능 탭. Query·배타 가드. */
export const WritableReviewsPanel = ({
  enabled,
  onWriteClick,
}: WritableReviewsPanelProps) => {
  const writable = useCustomerWritableQuotes({ enabled });
  const items = writable.writableQuotes;

  // 로딩 — 초기 조회 (페이지 전환 keepPreviousData는 목록 오버레이)
  if (writable.isPending && items.length === 0) {
    return (
      <ReviewsListStatus
        variant="pending"
        message="작성 가능한 리뷰를 불러오는 중..."
      />
    );
  }

  // 에러 — 재시도
  if (writable.isError) {
    return (
      <ReviewsListStatus
        variant="error"
        message={resolveApiErrorMessage(
          writable.error,
          '작성 가능한 리뷰를 불러오지 못했습니다.'
        )}
        onRetry={() => {
          void writable.refetch();
        }}
      />
    );
  }

  // 빈 목록
  if (isReviewListEmpty(writable)) {
    return <ReviewsListStatus variant="empty" />;
  }

  // 본문 — 그리드 + 페이지네이션
  return (
    <ReviewsContent>
      <ReviewListSection
        items={items}
        pagination={{
          page: writable.page,
          totalPages: writable.totalPages,
          onPageChange: writable.setPage,
          isFetching: writable.isFetching && !writable.isPending,
          getItemKey: (item) => item.quoteId,
        }}
        renderItem={(item) => (
          <WritableReviewCard item={item} onWriteClick={onWriteClick} />
        )}
      />
    </ReviewsContent>
  );
};
