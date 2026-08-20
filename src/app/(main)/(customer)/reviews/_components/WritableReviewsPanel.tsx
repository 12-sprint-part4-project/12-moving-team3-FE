'use client';

import { useState } from 'react';

import { ReviewListSection } from '@/components/reviews/ReviewListSection';
import { WritableReviewCard } from '@/components/reviews/WritableReviewCard';
import { WriteReviewModal } from '@/components/reviews/WriteReviewModal';
import { Modal } from '@/components/ui/Modal/Modal';
import { useCreateReview } from '@/hooks/useCreateReview';
import { useCustomerWritableQuotes } from '@/hooks/useCustomerWritableQuotes';
import { resolveApiErrorMessage } from '@/lib/apiClient';

import { isReviewListEmpty } from '../_lib/isReviewListEmpty';
import { ReviewsContent, ReviewsListStatus } from './ReviewsListStatus';

import type { ReactNode } from 'react';
import type { WritableQuoteItem } from '@/types/review';

export interface WritableReviewsPanelProps {
  enabled: boolean;
  onReviewCreated: (reviewId: number) => void;
}

/** `/reviews` 작성 가능 탭. Query·작성 모달. */
export const WritableReviewsPanel = ({
  enabled,
  onReviewCreated,
}: WritableReviewsPanelProps) => {
  const [selectedQuote, setSelectedQuote] = useState<WritableQuoteItem | null>(
    null
  );

  const writable = useCustomerWritableQuotes({ enabled });
  const { submitReview, isPending: isSubmitting } = useCreateReview();
  const items = writable.writableQuotes;

  const handleWriteClick = (item: WritableQuoteItem) => {
    setSelectedQuote(item);
  };

  const handleCloseWriteModal = () => {
    if (isSubmitting) {
      return;
    }
    setSelectedQuote(null);
  };

  const handleSubmitReview = async (review: {
    rating: number;
    content: string;
  }) => {
    if (!selectedQuote || isSubmitting) {
      return;
    }

    try {
      const reviewId = await submitReview(selectedQuote.quoteId, review);
      if (reviewId) {
        setSelectedQuote(null);
        onReviewCreated(reviewId);
      }
    } catch {
      // 성공/실패 토스트는 useCreateReview에서 처리
    }
  };

  let listBody: ReactNode;

  if (writable.isPending && items.length === 0) {
    listBody = (
      <ReviewsListStatus
        variant="pending"
        message="작성 가능한 리뷰를 불러오는 중..."
      />
    );
  } else if (writable.isError) {
    listBody = (
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
  } else if (isReviewListEmpty(writable)) {
    listBody = <ReviewsListStatus variant="empty" />;
  } else {
    listBody = (
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
            <WritableReviewCard item={item} onWriteClick={handleWriteClick} />
          )}
        />
      </ReviewsContent>
    );
  }

  return (
    <>
      {listBody}

      {selectedQuote ? (
        <Modal placement="bottom" onClose={handleCloseWriteModal}>
          <WriteReviewModal
            key={selectedQuote.quoteId}
            quote={selectedQuote}
            onClose={handleCloseWriteModal}
            onSubmit={(review) => {
              void handleSubmitReview(review);
            }}
            isSubmitting={isSubmitting}
          />
        </Modal>
      ) : null}
    </>
  );
};
