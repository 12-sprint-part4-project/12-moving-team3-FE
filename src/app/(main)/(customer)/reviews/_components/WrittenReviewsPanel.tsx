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
import { useTranslation } from '@/i18n/useTranslation';
import { resolveApiErrorMessage } from '@/lib/apiClient';

import { isReviewListEmpty } from '../_lib/isReviewListEmpty';
import { useHighlightWrittenReview } from '../_lib/useHighlightWrittenReview';
import { ReviewsContent } from './ReviewsListStatus';
import type { CustomerReviewItem } from '@/types/review';
import { WrittenReviewsListStatus } from './WrittenReviewsListStatus';

export interface WrittenReviewsPanelProps {
  enabled: boolean;
  highlightReviewId: number | null;
}

/** `/reviews` 내가 작성한 리뷰 탭. Query·상세/수정/삭제 모달. */
export const WrittenReviewsPanel = ({
  enabled,
  highlightReviewId,
}: WrittenReviewsPanelProps) => {
  const { t } = useTranslation();
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

  const modals = (
    <>
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

  const isInitialPending = written.isPending && items.length === 0;
  const isEmpty = isReviewListEmpty(written);
  const errorMessage = resolveApiErrorMessage(
    written.error,
    t('reviews.written.error')
  );

  if (isInitialPending || written.isError || isEmpty) {
    return (
      <WrittenReviewsListStatus
        isPending={isInitialPending}
        isError={written.isError}
        errorMessage={errorMessage}
        onRetry={() => {
          void written.refetch();
        }}
      />
    );
  }

  return (
    <>
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

      {modals}
    </>
  );
};
