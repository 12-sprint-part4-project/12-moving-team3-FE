'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { DeleteReviewConfirmModal } from '@/components/reviews/DeleteReviewConfirmModal';
import { EditReviewModal } from '@/components/reviews/EditReviewModal';
import { ReviewDetailModal } from '@/components/reviews/ReviewDetailModal';
import { WriteReviewModal } from '@/components/reviews/WriteReviewModal';
import { Modal } from '@/components/ui/Modal/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useCreateReview } from '@/hooks/useCreateReview';
import { useDeleteReview } from '@/hooks/useDeleteReview';
import { useUpdateReview } from '@/hooks/useUpdateReview';
import { getMotionTransition, getTabPanelMotionProps } from '@/lib/motionVariants';

import { WritableReviewsPanel } from './_components/WritableReviewsPanel';
import { WrittenReviewsPanel } from './_components/WrittenReviewsPanel';

import type { ReviewsPageTab } from '@/components/reviews/ReviewsTabs';
import type { CustomerReviewItem, WritableQuoteItem } from '@/types/review';

export interface ReviewsPageClientProps {
  activeTab: ReviewsPageTab;
  highlightReviewId: number | null;
}

/** `/reviews` 클라이언트. - 탭 패널·작성/수정/삭제 모달 오케스트레이션. */
const ReviewsPageClient = ({
  activeTab,
  highlightReviewId,
}: ReviewsPageClientProps) => {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const { user, isReady } = useAuth();

  const [selectedQuote, setSelectedQuote] = useState<WritableQuoteItem | null>(
    null
  );
  const [selectedReview, setSelectedReview] =
    useState<CustomerReviewItem | null>(null);
  const [editingReview, setEditingReview] = useState<CustomerReviewItem | null>(
    null
  );
  const [reviewToDelete, setReviewToDelete] =
    useState<CustomerReviewItem | null>(null);

  const { submitReview, isPending: isSubmitting } = useCreateReview();
  const { submitUpdate, isPending: isUpdating } = useUpdateReview();
  const { submitDelete, isPending: isDeleting } = useDeleteReview();

  const isCustomerReady = isReady && user?.userType === 'CUSTOMER';
  const isActiveTabWritable = activeTab === 'writable';
  const tabDirection = activeTab === 'written' ? 1 : -1;
  const tabPanelMotion = getTabPanelMotionProps(
    tabDirection,
    getMotionTransition(shouldReduceMotion)
  );

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
        router.replace(`/reviews?tab=written&highlight=${reviewId}`);
      }
    } catch {
      // 성공/실패 토스트는 useCreateReview에서 처리
    }
  };

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

  return (
    <>
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden bg-background-200">
        <AnimatePresence mode="wait" custom={tabDirection}>
          {isActiveTabWritable ? (
            <motion.div
              key="writable"
              {...tabPanelMotion}
              role="tabpanel"
              id="reviews-panel-writable"
              aria-labelledby="reviews-tab-writable"
              className="flex min-h-0 flex-1 flex-col"
            >
              <WritableReviewsPanel
                enabled={isCustomerReady}
                onWriteClick={handleWriteClick}
              />
            </motion.div>
          ) : (
            <motion.div
              key="written"
              {...tabPanelMotion}
              role="tabpanel"
              id="reviews-panel-written"
              aria-labelledby="reviews-tab-written"
              className="flex min-h-0 flex-1 flex-col"
            >
              <WrittenReviewsPanel
                enabled={isCustomerReady}
                highlightReviewId={highlightReviewId}
                onReviewClick={handleReviewClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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

export default ReviewsPageClient;
