'use client';

import { useState } from 'react';

import { DeleteReviewConfirmModal } from '@/components/reviews/DeleteReviewConfirmModal';
import { EditReviewModal } from '@/components/reviews/EditReviewModal';
import { ReviewListSection } from '@/components/reviews/ReviewListSection';
import { ReviewsEmptyState } from '@/components/reviews/ReviewsEmptyState';
import { ReviewDetailModal } from '@/components/reviews/ReviewDetailModal';
import {
  ReviewsTabs,
  REVIEWS_PAGE_X_PADDING,
  type ReviewsPageTab,
} from '@/components/reviews/ReviewsTabs';
import { WritableReviewCard } from '@/components/reviews/WritableReviewCard';
import { WriteReviewModal } from '@/components/reviews/WriteReviewModal';
import { WrittenReviewCard } from '@/components/reviews/WrittenReviewCard';
import { Modal } from '@/components/ui/Modal/Modal';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useCreateReview } from '@/hooks/useCreateReview';
import { useCustomerReviews } from '@/hooks/useCustomerReviews';
import { useCustomerWritableQuotes } from '@/hooks/useCustomerWritableQuotes';
import { useDeleteReview } from '@/hooks/useDeleteReview';
import { useUpdateReview } from '@/hooks/useUpdateReview';
import { ApiError } from '@/lib/apiClient';
import { formatReviewMoveDate } from '@/lib/reviewDisplay';
import { formatQuotePriceLabel } from '@/services/quoteApi';
import type { CustomerReviewItem, WritableQuoteItem } from '@/types/review';

/** 내 견적 관리와 동일한 본문 컨테이너 */
const CONTENT_CLASS = `mx-auto w-full max-w-[1920px] py-6 md:py-8 lg:py-10 ${REVIEWS_PAGE_X_PADDING}`;

/** 이사 리뷰 — 작성 가능 / 내가 작성한 리뷰 + 모달 */
export const ReviewsPageClient = () => {
  const { user, isReady } = useAuth();
  const [activeTab, setActiveTab] = useState<ReviewsPageTab>('writable');
  const [selectedQuote, setSelectedQuote] = useState<WritableQuoteItem | null>(
    null
  );
  const [selectedReview, setSelectedReview] =
    useState<CustomerReviewItem | null>(null);
  const [editingReview, setEditingReview] =
    useState<CustomerReviewItem | null>(null);
  const [reviewToDelete, setReviewToDelete] =
    useState<CustomerReviewItem | null>(null);

  const isLoggedIn = Boolean(user);

  const writable = useCustomerWritableQuotes({
    enabled: isLoggedIn && activeTab === 'writable',
  });
  const written = useCustomerReviews({
    enabled: isLoggedIn && activeTab === 'written',
  });

  const { submitReview, isPending: isSubmitting } = useCreateReview();
  const { submitUpdate, isPending: isUpdating } = useUpdateReview();
  const { submitDelete, isPending: isDeleting } = useDeleteReview();

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
      const performed = await submitReview(selectedQuote.quoteId, review);
      if (performed) {
        setSelectedQuote(null);
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

  const writableErrorMessage =
    writable.error instanceof ApiError
      ? writable.error.message
      : (writable.error?.message ??
        '작성 가능한 리뷰를 불러오지 못했습니다.');

  const writtenErrorMessage =
    written.error instanceof ApiError
      ? written.error.message
      : (written.error?.message ?? '작성한 리뷰를 불러오지 못했습니다.');

  if (!isReady || !user) {
    return (
      <div className="flex min-h-0 w-full flex-1 items-center justify-center bg-background-200">
        <Spinner message="로딩 중..." />
      </div>
    );
  }

  const writableTotal = writable.pagination?.totalCount ?? 0;
  const showWritableEmpty =
    !writable.isPending &&
    !writable.isError &&
    (writable.isEmpty || writableTotal === 0);

  const writtenTotal = written.pagination?.totalCount ?? 0;
  const showWrittenEmpty =
    !written.isPending &&
    !written.isError &&
    (written.isEmpty || writtenTotal === 0);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden">
      <ReviewsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="min-h-0 w-full flex-1 bg-background-200">
        <div
          role="tabpanel"
          id="reviews-panel-writable"
          aria-labelledby="reviews-tab-writable"
          hidden={activeTab !== 'writable'}
        >
          <div className={CONTENT_CLASS}>
            <ReviewListSection
              items={writable.writableQuotes}
              isPending={writable.isPending}
              isError={writable.isError}
              showEmpty={showWritableEmpty}
              pendingMessage="작성 가능한 리뷰를 불러오는 중..."
              errorMessage={writableErrorMessage}
              onRetry={() => {
                void writable.refetch();
              }}
              emptyState={<ReviewsEmptyState />}
              renderItem={(item) => (
                <WritableReviewCard
                  key={item.quoteId}
                  item={item}
                  onWriteClick={handleWriteClick}
                />
              )}
              page={writable.page}
              totalPages={writable.totalPages}
              onPageChange={writable.setPage}
            />
          </div>
        </div>

        <div
          role="tabpanel"
          id="reviews-panel-written"
          aria-labelledby="reviews-tab-written"
          hidden={activeTab !== 'written'}
        >
          <div className={CONTENT_CLASS}>
            <ReviewListSection
              items={written.reviews}
              isPending={written.isPending}
              isError={written.isError}
              showEmpty={showWrittenEmpty}
              pendingMessage="작성한 리뷰를 불러오는 중..."
              errorMessage={writtenErrorMessage}
              onRetry={() => {
                void written.refetch();
              }}
              emptyState={
                <ReviewsEmptyState message="아직 작성한 리뷰가 없어요" />
              }
              renderItem={(item) => (
                <WrittenReviewCard
                  key={item.id}
                  item={item}
                  onClick={handleReviewClick}
                />
              )}
              page={written.page}
              totalPages={written.totalPages}
              onPageChange={written.setPage}
            />
          </div>
        </div>
      </div>

      {selectedQuote ? (
        <Modal placement="bottom" onClose={handleCloseWriteModal}>
          <WriteReviewModal
            onClose={handleCloseWriteModal}
            onSubmit={(review) => {
              void handleSubmitReview(review);
            }}
            moveType={selectedQuote.moveType}
            isDesignated={selectedQuote.isDesignated}
            moverName={selectedQuote.mover?.name?.trim() || '기사'}
            moveDate={formatReviewMoveDate(selectedQuote.moveDate)}
            quotePrice={formatQuotePriceLabel(selectedQuote.price)}
            avatarSrc={selectedQuote.mover?.profileImageUrl ?? undefined}
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
    </div>
  );
};
