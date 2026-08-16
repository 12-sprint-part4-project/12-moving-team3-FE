'use client';

import { ReviewListSection } from '@/components/reviews/ReviewListSection';
import { ReviewsEmptyState } from '@/components/reviews/ReviewsEmptyState';
import { REVIEWS_CONTENT_CLASS } from '@/components/reviews/ReviewsTabs';
import { WritableReviewCard } from '@/components/reviews/WritableReviewCard';
import { useCustomerWritableQuotes } from '@/hooks/useCustomerWritableQuotes';
import { resolveApiErrorMessage } from '@/lib/apiClient';

import { isReviewListEmpty } from '../_lib/isReviewListEmpty';

import type { WritableQuoteItem } from '@/types/review';

export interface WritableReviewsPanelProps {
  enabled: boolean;
  onWriteClick: (item: WritableQuoteItem) => void;
}

/** `/reviews` 작성 가능 탭. Query·목록 가드. */
export const WritableReviewsPanel = ({
  enabled,
  onWriteClick,
}: WritableReviewsPanelProps) => {
  const writable = useCustomerWritableQuotes({ enabled });

  return (
    <div className={REVIEWS_CONTENT_CLASS}>
      <ReviewListSection
        items={writable.writableQuotes}
        status={{
          isPending: writable.isPending,
          isError: writable.isError,
          showEmpty: isReviewListEmpty(writable),
          pendingMessage: '작성 가능한 리뷰를 불러오는 중...',
          errorMessage: resolveApiErrorMessage(
            writable.error,
            '작성 가능한 리뷰를 불러오지 못했습니다.'
          ),
          onRetry: () => {
            void writable.refetch();
          },
          emptyState: <ReviewsEmptyState />,
        }}
        pagination={{
          page: writable.page,
          totalPages: writable.totalPages,
          onPageChange: writable.setPage,
          isFetching: writable.isFetching,
          getItemKey: (item) => item.quoteId,
        }}
        renderItem={(item) => (
          <WritableReviewCard item={item} onWriteClick={onWriteClick} />
        )}
      />
    </div>
  );
};
