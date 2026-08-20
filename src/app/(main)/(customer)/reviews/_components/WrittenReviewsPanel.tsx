'use client';

import { useState } from 'react';

import { DeleteReviewConfirmModal } from '@/components/reviews/DeleteReviewConfirmModal';
import { EditReviewModal } from '@/components/reviews/EditReviewModal';
import { ReviewDetailModal } from '@/components/reviews/ReviewDetailModal';
import { ReviewListSection } from '@/components/reviews/ReviewListSection';
import { WrittenReviewCard } from '@/components/reviews/WrittenReviewCard';
import { Modal } from '@/components/ui/Modal/Modal';
import { useCustomerReviews } from '@/hooks/useCustomerReviews';
import { useDeleteReview } from '@/hooks/useDeleteReview';
import { useUpdateReview } from '@/hooks/useUpdateReview';
import { resolveApiErrorMessage } from '@/lib/apiClient';

import { isReviewListEmpty } from '../_lib/isReviewListEmpty';
import { useHighlightWrittenReview } from '../_lib/useHighlightWrittenReview';
import { ReviewsContent, ReviewsListStatus } from './ReviewsListStatus';

import type { ReactNode } from 'react';
import type { CustomerReviewItem } from '@/types/review';

export interface WrittenReviewsPanelProps {
  enabled: boolean;
  highlightReviewId: number | null;
}

/** `/reviews` 내가 작성한 리뷰 탭. Query·상세/수정/삭제 모달. */
export const WrittenReviewsPanel = ({
  enabled,
  highlightReviewId,
}: WrittenReviewsPanelProps) => {
  const [selectedReview, setSelectedReview] =
    useState<CustomerReviewItem | null>(null);
  const [editingReview, setEditingReview] = useState<CustomerReviewItem | null>(
    null
  );
  const [reviewToDelete, setReviewToDelete] =
    useState<CustomerReviewItem | null>(null);

  const written = useCustomerReviews({ enabled });
  const { submitUpdate, isPending: isUpdating } = useUpdateReview();
  const { submitDelete, isPending: isDeleting } = useDeleteReview();
  const items = written.reviews;
  const { cardRef, isHighlighted } = useHighlightWrittenReview({
    highlightReviewId,
    reviews: items,
    isPending: written.isPending,
    isError: written.isError,
  });

  const handleReviewClick = (item: CustomerReviewItem) => {
    setEditingReview(null);
    setReviewToDelete(null);
    setSelectedReview(item);
  };

  const handleCloseDetailModal = () => {
    setSelectedReview(null);
  };

  const handleEditReview = () => {
    if (!selectedReview) {
      return;
    }
    setEditingReview(selectedReview);
    setSelectedReview(null);
  };

  const handleRequestDelete = () => {
    if (!selectedReview) {
      return;
    }
    setReviewToDelete(selectedReview);
    setSelectedReview(null);
  };

  const handleCloseEditModal = () => {
    if (isUpdating) {
      return;
    }
    setEditingReview(null);
  };

  const handleSubmitUpdate = async (review: {
    rating: number;
    content: string;
  }) => {
    if (!editingReview || isUpdating) {
      return;
    }

    try {
      const performed = await submitUpdate(editingReview.id, review);
      if (performed) {
        setEditingReview(null);
      }
    } catch {
      // 성공/실패 토스트는 useUpdateReview에서 처리
    }
  };

  const handleCloseDeleteConfirm = () => {
    if (isDeleting) {
      return;
    }
    setReviewToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete || isDeleting) {
      return;
    }

    try {
      const performed = await submitDelete(reviewToDelete.id);
      if (performed) {
        setReviewToDelete(null);
      }
    } catch {
      // 성공/실패 토스트는 useDeleteReview에서 처리
    }
  };

  let listBody: ReactNode;

  if (written.isPending && items.length === 0) {
    listBody = (
      <ReviewsListStatus
        variant="pending"
        message="작성한 리뷰를 불러오는 중..."
      />
    );
  } else if (written.isError) {
    listBody = (
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
  } else if (isReviewListEmpty(written)) {
    listBody = (
      <ReviewsListStatus
        variant="empty"
        message="아직 작성한 리뷰가 없어요"
      />
    );
  } else {
    listBody = (
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
              onClick={handleReviewClick}
            />
          )}
        />
      </ReviewsContent>
    );
  }

  return (
    <>
      {listBody}

      {selectedReview ? (
        <Modal placement="bottom" onClose={handleCloseDetailModal}>
          <ReviewDetailModal
            review={selectedReview}
            onClose={handleCloseDetailModal}
            onEdit={handleEditReview}
            onDelete={handleRequestDelete}
          />
        </Modal>
      ) : null}

      {editingReview ? (
        <Modal placement="bottom" onClose={handleCloseEditModal}>
          <EditReviewModal
            key={editingReview.id}
            review={editingReview}
            onClose={handleCloseEditModal}
            onSubmit={(review) => {
              void handleSubmitUpdate(review);
            }}
            isSubmitting={isUpdating}
          />
        </Modal>
      ) : null}

      {reviewToDelete ? (
        <Modal placement="bottom" onClose={handleCloseDeleteConfirm}>
          <DeleteReviewConfirmModal
            onClose={handleCloseDeleteConfirm}
            onConfirm={() => {
              void handleConfirmDelete();
            }}
            isDeleting={isDeleting}
          />
        </Modal>
      ) : null}
    </>
  );
};
