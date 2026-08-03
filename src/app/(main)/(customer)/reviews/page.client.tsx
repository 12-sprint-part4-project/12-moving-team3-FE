'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ReviewsEmptyState } from '@/components/reviews/ReviewsEmptyState';
import { ReviewDetailModal } from '@/components/reviews/ReviewDetailModal';
import {
  ReviewsTabs,
  type ReviewsPageTab,
} from '@/components/reviews/ReviewsTabs';
import { WritableReviewCard } from '@/components/reviews/WritableReviewCard';
import { WriteReviewModal } from '@/components/reviews/WriteReviewModal';
import { WrittenReviewCard } from '@/components/reviews/WrittenReviewCard';
import { Modal } from '@/components/ui/Modal/Modal';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useCreateReview } from '@/hooks/useCreateReview';
import { useCustomerReviews } from '@/hooks/useCustomerReviews';
import { useCustomerWritableQuotes } from '@/hooks/useCustomerWritableQuotes';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { formatReviewMoveDate } from '@/lib/reviewDisplay';
import { cn } from '@/lib/utils';
import { formatQuotePriceLabel } from '@/services/quoteApi';
import type { CustomerReviewItem, WritableQuoteItem } from '@/types/review';

const pageXPadding = 'px-6 md:px-[4.5rem] xl:px-[16.25rem]';

/** 이사 리뷰 — 작성 가능 / 내가 작성한 리뷰 + 모달 */
export const ReviewsPageClient = () => {
  const router = useRouter();
  const { user, isReady } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<ReviewsPageTab>('writable');
  const [selectedQuote, setSelectedQuote] = useState<WritableQuoteItem | null>(
    null
  );
  const [selectedReview, setSelectedReview] =
    useState<CustomerReviewItem | null>(null);

  const isLoggedIn = Boolean(user);

  const writable = useCustomerWritableQuotes({
    enabled: isLoggedIn && activeTab === 'writable',
  });
  const written = useCustomerReviews({
    enabled: isLoggedIn && activeTab === 'written',
  });

  const { mutateAsync, isPending: isSubmitting } = useCreateReview();

  useEffect(() => {
    if (isReady && !user) {
      router.replace('/login');
    }
  }, [isReady, user, router]);

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
      await mutateAsync({
        quoteId: selectedQuote.quoteId,
        body: review,
      });
      setSelectedQuote(null);
      showToast({ content: '리뷰가 등록되었습니다.' });
    } catch {
      // onError 토스트는 useCreateReview에서 처리
    }
  };

  const handleReviewClick = (item: CustomerReviewItem) => {
    setSelectedReview(item);
  };

  const handleCloseDetailModal = () => {
    setSelectedReview(null);
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
      <div className="flex w-full justify-center bg-background-200 py-16">
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
    <div className="flex w-full flex-col overflow-x-hidden bg-background-200">
      <ReviewsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div
        className={cn(
          'mx-auto flex w-full max-w-[1920px] flex-col gap-8 py-6 md:py-10 xl:py-10',
          pageXPadding
        )}
      >
        {activeTab === 'writable' ? (
          <>
            {writable.isPending && writable.writableQuotes.length === 0 ? (
              <Spinner message="작성 가능한 리뷰를 불러오는 중..." />
            ) : null}

            {writable.isError ? (
              <div className="flex flex-col items-start gap-3 py-10">
                <p className="text-md-medium text-gray-400">
                  {writableErrorMessage}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    void writable.refetch();
                  }}
                  className="text-md-semibold text-blue-300 underline"
                >
                  다시 시도
                </button>
              </div>
            ) : null}

            {!writable.isError && showWritableEmpty ? (
              <ReviewsEmptyState />
            ) : null}

            {!writable.isError &&
            !showWritableEmpty &&
            writable.writableQuotes.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-8 xl:grid-cols-2 xl:gap-x-6 xl:gap-y-10">
                  {writable.writableQuotes.map((item) => (
                    <WritableReviewCard
                      key={item.quoteId}
                      item={item}
                      onWriteClick={handleWriteClick}
                    />
                  ))}
                </div>

                <div className="flex justify-center pt-2">
                  <Pagination
                    size="sm"
                    page={writable.page}
                    totalPages={Math.max(1, writable.totalPages)}
                    onPageChange={writable.setPage}
                    className="xl:hidden"
                  />
                  <Pagination
                    size="lg"
                    page={writable.page}
                    totalPages={Math.max(1, writable.totalPages)}
                    onPageChange={writable.setPage}
                    className="hidden xl:flex"
                  />
                </div>
              </>
            ) : null}
          </>
        ) : (
          <>
            {written.isPending && written.reviews.length === 0 ? (
              <Spinner message="작성한 리뷰를 불러오는 중..." />
            ) : null}

            {written.isError ? (
              <div className="flex flex-col items-start gap-3 py-10">
                <p className="text-md-medium text-gray-400">
                  {writtenErrorMessage}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    void written.refetch();
                  }}
                  className="text-md-semibold text-blue-300 underline"
                >
                  다시 시도
                </button>
              </div>
            ) : null}

            {!written.isError && showWrittenEmpty ? (
              <ReviewsEmptyState message="아직 작성한 리뷰가 없어요" />
            ) : null}

            {!written.isError &&
            !showWrittenEmpty &&
            written.reviews.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-8 xl:grid-cols-2 xl:gap-x-6 xl:gap-y-10">
                  {written.reviews.map((item) => (
                    <WrittenReviewCard
                      key={item.id}
                      item={item}
                      onClick={handleReviewClick}
                    />
                  ))}
                </div>

                <div className="flex justify-center pt-2">
                  <Pagination
                    size="sm"
                    page={written.page}
                    totalPages={Math.max(1, written.totalPages)}
                    onPageChange={written.setPage}
                    className="xl:hidden"
                  />
                  <Pagination
                    size="lg"
                    page={written.page}
                    totalPages={Math.max(1, written.totalPages)}
                    onPageChange={written.setPage}
                    className="hidden xl:flex"
                  />
                </div>
              </>
            ) : null}
          </>
        )}
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
          />
        </Modal>
      ) : null}
    </div>
  );
};
