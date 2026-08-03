'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ReviewsEmptyState } from '@/components/reviews/ReviewsEmptyState';
import { ReviewsTabs, type ReviewsPageTab } from '@/components/reviews/ReviewsTabs';
import { WritableReviewCard } from '@/components/reviews/WritableReviewCard';
import { Modal } from '@/components/ui/Modal/Modal';
import { WriteReviewModal } from '@/components/ui/Modal/WriteReviewModal';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useCreateReview } from '@/hooks/useCreateReview';
import { useCustomerWritableQuotes } from '@/hooks/useCustomerWritableQuotes';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { formatReviewMoveDate } from '@/lib/reviewDisplay';
import { cn } from '@/lib/utils';
import { formatQuotePriceLabel } from '@/services/quoteApi';
import type { WritableQuoteItem } from '@/types/review';

const pageXPadding =
  'px-6 md:px-[4.5rem] xl:px-[16.25rem]';

/** 이사 리뷰 — 작성 가능 목록 + 등록 모달 */
export const ReviewsPageClient = () => {
  const router = useRouter();
  const { user, isReady } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<ReviewsPageTab>('writable');
  const [selectedQuote, setSelectedQuote] = useState<WritableQuoteItem | null>(
    null
  );

  const isLoggedIn = Boolean(user);
  const {
    writableQuotes,
    pagination,
    page,
    totalPages,
    setPage,
    isPending,
    isError,
    error,
    isEmpty,
    refetch,
  } = useCustomerWritableQuotes({ enabled: isLoggedIn && activeTab === 'writable' });

  const { mutateAsync, isPending: isSubmitting } = useCreateReview();

  useEffect(() => {
    if (isReady && !user) {
      router.replace('/login');
    }
  }, [isReady, user, router]);

  const handleWriteClick = (item: WritableQuoteItem) => {
    setSelectedQuote(item);
  };

  const handleCloseModal = () => {
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

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : (error?.message ?? '작성 가능한 리뷰를 불러오지 못했습니다.');

  if (!isReady || !user) {
    return (
      <div className="flex w-full justify-center bg-background-200 py-16">
        <Spinner message="로딩 중..." />
      </div>
    );
  }

  const totalCount = pagination?.totalCount ?? 0;
  const showWritableEmpty = !isPending && !isError && (isEmpty || totalCount === 0);

  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-background-200">
      <ReviewsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div
        className={cn(
          'mx-auto flex w-full max-w-[1920px] flex-col gap-8 py-6 md:py-10 xl:py-10',
          pageXPadding
        )}
      >
        {activeTab === 'written' ? (
          <ReviewsEmptyState message="아직 작성한 리뷰가 없어요" />
        ) : (
          <>
            {isPending && writableQuotes.length === 0 ? (
              <Spinner message="작성 가능한 리뷰를 불러오는 중..." />
            ) : null}

            {isError ? (
              <div className="flex flex-col items-start gap-3 py-10">
                <p className="text-md-medium text-gray-400">{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => {
                    void refetch();
                  }}
                  className="text-md-semibold text-blue-300 underline"
                >
                  다시 시도
                </button>
              </div>
            ) : null}

            {!isError && showWritableEmpty ? (
              <ReviewsEmptyState />
            ) : null}

            {!isError && !showWritableEmpty && writableQuotes.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-8 xl:grid-cols-2 xl:gap-x-6 xl:gap-y-10">
                  {writableQuotes.map((item) => (
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
                    page={page}
                    totalPages={Math.max(1, totalPages)}
                    onPageChange={setPage}
                    className="xl:hidden"
                  />
                  <Pagination
                    size="lg"
                    page={page}
                    totalPages={Math.max(1, totalPages)}
                    onPageChange={setPage}
                    className="hidden xl:flex"
                  />
                </div>
              </>
            ) : null}
          </>
        )}
      </div>

      {selectedQuote ? (
        <Modal placement="bottom" onClose={handleCloseModal}>
          <WriteReviewModal
            onClose={handleCloseModal}
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
    </div>
  );
};
