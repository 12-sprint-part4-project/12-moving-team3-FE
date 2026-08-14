'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { DeleteReviewConfirmModal } from '@/components/reviews/DeleteReviewConfirmModal';
import { EditReviewModal } from '@/components/reviews/EditReviewModal';
import { ReviewDetailModal } from '@/components/reviews/ReviewDetailModal';
import {
  ReviewListSection,
  type ReviewListStatus,
} from '@/components/reviews/ReviewListSection';
import { ReviewsEmptyState } from '@/components/reviews/ReviewsEmptyState';
import {
  parseHighlightReviewId,
  parseReviewsTabId,
  REVIEW_HIGHLIGHT_DURATION_MS,
  REVIEWS_PAGE_X_PADDING,
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
import {
  fadeIn,
  getMotionTransition,
  tabContentSlide,
} from '@/lib/motionVariants';

import type { CustomerReviewItem, WritableQuoteItem } from '@/types/review';

/** 내 견적 관리와 동일한 본문 컨테이너 — 패널 높이 채움(페이지네이션 mt-auto용) */
const CONTENT_CLASS = `mx-auto flex min-h-0 w-full max-w-[1920px] flex-1 flex-col py-6 md:py-8 lg:py-10 ${REVIEWS_PAGE_X_PADDING}`;

const toListErrorMessage = (error: unknown, fallback: string) =>
  error instanceof ApiError
    ? error.message
    : error instanceof Error
      ? error.message
      : fallback;

const isReviewListEmpty = (list: {
  isPending: boolean;
  isError: boolean;
  isEmpty: boolean;
  pagination?: { totalCount: number } | null;
}) =>
  !list.isPending &&
  !list.isError &&
  (list.isEmpty || (list.pagination?.totalCount ?? 0) === 0);

/** 이사 리뷰 — 작성 가능 / 내가 작성한 리뷰 + 모달 */
export const ReviewsPageClient = () => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const router = useRouter();
  const highlightCardRef = useRef<HTMLButtonElement>(null);
  const highlightHandledRef = useRef<number | null>(null);

  const searchParams = useSearchParams();
  const activeTab = parseReviewsTabId(searchParams.get('tab'));
  const highlightReviewId = parseHighlightReviewId(
    searchParams.get('highlight')
  );
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

  const isLoggedIn = Boolean(user);

  const writable = useCustomerWritableQuotes({
    enabled: isLoggedIn && activeTab === 'writable',
  });
  const written = useCustomerReviews({
    enabled: isLoggedIn && activeTab === 'written',
  });

  useEffect(() => {
    if (highlightReviewId === null) {
      highlightHandledRef.current = null;
      return;
    }

    if (
      activeTab !== 'written' ||
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
    activeTab,
    highlightReviewId,
    router,
    written.isError,
    written.isPending,
    written.reviews,
  ]);

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

  if (!isReady || !user) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        transition={motionTransition}
        className="flex min-h-0 w-full flex-1 items-center justify-center bg-background-200"
      >
        <Spinner message="로딩 중..." />
      </motion.div>
    );
  }

  const writableStatus: ReviewListStatus = {
    isPending: writable.isPending,
    isError: writable.isError,
    showEmpty: isReviewListEmpty(writable),
    pendingMessage: '작성 가능한 리뷰를 불러오는 중...',
    errorMessage: toListErrorMessage(
      writable.error,
      '작성 가능한 리뷰를 불러오지 못했습니다.'
    ),
    onRetry: () => {
      void writable.refetch();
    },
    emptyState: <ReviewsEmptyState />,
  };

  const writtenStatus: ReviewListStatus = {
    isPending: written.isPending,
    isError: written.isError,
    showEmpty: isReviewListEmpty(written),
    pendingMessage: '작성한 리뷰를 불러오는 중...',
    errorMessage: toListErrorMessage(
      written.error,
      '작성한 리뷰를 불러오지 못했습니다.'
    ),
    onRetry: () => {
      void written.refetch();
    },
    emptyState: <ReviewsEmptyState message="아직 작성한 리뷰가 없어요" />,
  };

  const tabDirection = activeTab === 'written' ? 1 : -1;

  return (
    <>
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden bg-background-200">
        <AnimatePresence mode="wait" custom={tabDirection}>
          {activeTab === 'writable' ? (
            <motion.div
              key="writable"
              custom={tabDirection}
              variants={tabContentSlide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={motionTransition}
              role="tabpanel"
              id="reviews-panel-writable"
              aria-labelledby="reviews-tab-writable"
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className={CONTENT_CLASS}>
                <ReviewListSection
                  items={writable.writableQuotes}
                  status={writableStatus}
                  pagination={{
                    page: writable.page,
                    totalPages: writable.totalPages,
                    onPageChange: writable.setPage,
                    isFetching: writable.isFetching,
                    getItemKey: (item) => item.quoteId,
                  }}
                  renderItem={(item) => (
                    <WritableReviewCard
                      item={item}
                      onWriteClick={handleWriteClick}
                    />
                  )}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="written"
              custom={tabDirection}
              variants={tabContentSlide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={motionTransition}
              role="tabpanel"
              id="reviews-panel-written"
              aria-labelledby="reviews-tab-written"
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className={CONTENT_CLASS}>
                <ReviewListSection
                  items={written.reviews}
                  status={writtenStatus}
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
                        onClick={handleReviewClick}
                      />
                    );
                  }}
                />
              </div>
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
