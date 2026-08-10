'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { Button } from '@/components/Button/Button';
import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { ProfileRequiredModal } from '@/components/auth/ProfileRequiredModal';
import {
  QuotesListSkeleton,
  ReceivedQuotesListSkeleton,
} from '@/components/quotes/QuotesPageSkeleton';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useConfirmQuoteModal } from '@/hooks/useConfirmQuoteModal';
import {
  PAST_QUOTE_GROUP_LIMIT,
  useCustomerPastQuotes,
} from '@/hooks/useCustomerPastQuotes';
import { useCustomerPendingQuotes } from '@/hooks/useCustomerPendingQuotes';
import { useFavoriteAction } from '@/hooks/useFavoriteAction';
import { ApiError } from '@/lib/apiClient';

import { ConfirmQuoteModal } from './_components/ConfirmQuoteModal';
import {
  CUSTOMER_QUOTES_PAGE_X_PADDING,
  parseCustomerQuotesTabId,
} from './_components/CustomerQuotesTabs';
import { PendingQuoteCard } from './_components/PendingQuoteCard';
import { PendingQuotesEmptyState } from './_components/PendingQuotesEmptyState';
import { PendingRequestSubHeader } from './_components/PendingRequestSubHeader';
import { ReceivedQuoteGroupSection } from './_components/ReceivedQuoteGroupSection';

const CONTENT_CLASS = `mx-auto w-full max-w-[1920px] py-6 md:py-8 lg:py-10 ${CUSTOMER_QUOTES_PAGE_X_PADDING}`;

/** 고객 내 견적 관리 본문 */
const CustomerQuotesPageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = parseCustomerQuotesTabId(searchParams.get('tab'));
  const {
    handleFavoriteClick,
    isMoverPending,
    isLoginModalOpen,
    isProfileModalOpen,
    closeAuthModal,
  } = useFavoriteAction();

  const {
    quotes,
    summary,
    isWaitingForQuotes,
    hasNoActiveRequest,
    isPending,
    isError,
    error,
    refetch,
  } = useCustomerPendingQuotes({
    enabled: activeTab === 'pending',
  });

  const {
    groups,
    isEmpty: isPastEmpty,
    isPending: isPastPending,
    isError: isPastError,
    error: pastError,
    refetch: refetchPast,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useCustomerPastQuotes({
    limit: PAST_QUOTE_GROUP_LIMIT,
    enabled: activeTab === 'received',
  });

  const { ref: loadMoreRef, inView } = useInView({
    rootMargin: '200px',
  });

  useEffect(() => {
    if (
      activeTab === 'received' &&
      inView &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      void fetchNextPage();
    }
  }, [activeTab, inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  /** 견적 확정 후 이용 내역으로 이동 */
  const goToHistory = useCallback(() => {
    router.replace('/quotes/history');
  }, [router]);

  const {
    isConfirmModalOpen,
    isConfirming,
    confirmingQuoteId,
    openConfirmModal,
    closeConfirmModal,
    submitConfirm,
  } = useConfirmQuoteModal(goToHistory);

  /** 에러 메시지 추출 */
  const errorMessage =
    error instanceof ApiError
      ? error.message
      : '견적 목록을 불러오지 못했습니다.';

  const pastErrorMessage =
    pastError instanceof ApiError
      ? pastError.message
      : '견적 목록을 불러오지 못했습니다.';

  /** 목록 재조회 */
  const handleRetry = () => {
    void refetch();
  };

  const handlePastRetry = () => {
    void refetchPast();
  };

  /** 대기 중 탭 본문 렌더 */
  const renderPendingPanel = () => {
    if (isPending) {
      return (
        <div className={CONTENT_CLASS}>
          <QuotesListSkeleton />
        </div>
      );
    }

    if (isError) {
      return (
        <div className={CONTENT_CLASS}>
          <div className="flex flex-col items-center gap-4 py-16">
            <p role="alert" className="text-center text-lg-medium text-red-200">
              {errorMessage}
            </p>
            <Button
              size="sm"
              variant="outlined"
              className="max-w-[10rem]"
              onClick={handleRetry}
            >
              다시 시도
            </Button>
          </div>
        </div>
      );
    }

    if (hasNoActiveRequest) {
      return (
        <div className={CONTENT_CLASS}>
          <PendingQuotesEmptyState variant="noRequest" />
        </div>
      );
    }

    return (
      <>
        {summary ? <PendingRequestSubHeader summary={summary} /> : null}
        <div className={CONTENT_CLASS}>
          {isWaitingForQuotes ? (
            <PendingQuotesEmptyState variant="waiting" />
          ) : (
            <ul className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-8">
              {quotes.map((quote) => (
                <li key={quote.quoteId}>
                  <PendingQuoteCard
                    quote={quote}
                    isConfirming={isConfirming}
                    isConfirmingThis={confirmingQuoteId === quote.quoteId}
                    onConfirm={openConfirmModal}
                    onFavoriteClick={handleFavoriteClick}
                    isFavoritePending={isMoverPending(quote.mover.moverId)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </>
    );
  };

  /** 받았던 견적 탭 본문 렌더 */
  const renderReceivedPanel = () => {
    if (isPastPending) {
      return (
        <div className={CONTENT_CLASS}>
          <ReceivedQuotesListSkeleton />
        </div>
      );
    }

    if (isPastError) {
      return (
        <div className={CONTENT_CLASS}>
          <div className="flex flex-col items-center gap-4 py-16">
            <p role="alert" className="text-center text-lg-medium text-red-200">
              {pastErrorMessage}
            </p>
            <Button
              size="sm"
              variant="outlined"
              className="max-w-[10rem]"
              onClick={handlePastRetry}
            >
              다시 시도
            </Button>
          </div>
        </div>
      );
    }

    if (isPastEmpty) {
      return (
        <div className={CONTENT_CLASS}>
          <PendingQuotesEmptyState variant="receivedEmpty" />
        </div>
      );
    }

    return (
      <div className={CONTENT_CLASS}>
        <div className="mx-auto flex w-full max-w-[87.5rem] flex-col gap-6 md:gap-8 lg:gap-10">
          {groups.map((group) => (
            <ReceivedQuoteGroupSection
              key={group.estimateRequestId}
              group={group}
              onFavoriteClick={handleFavoriteClick}
              isMoverPending={isMoverPending}
            />
          ))}

          <div ref={loadMoreRef} className="flex w-full justify-center py-2">
            {isFetchingNextPage ? (
              <Spinner message="더 불러오는 중..." />
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="min-h-0 w-full flex-1 bg-background-200"
        role="tabpanel"
        id={`customer-quotes-panel-${activeTab}`}
        aria-labelledby={`customer-quotes-tab-${activeTab}`}
      >
        {activeTab === 'pending' ? renderPendingPanel() : renderReceivedPanel()}
      </div>

      <ConfirmQuoteModal
        open={isConfirmModalOpen}
        isConfirming={isConfirming}
        onClose={closeConfirmModal}
        onConfirm={submitConfirm}
      />

      <LoginRequiredModal open={isLoginModalOpen} onClose={closeAuthModal} />
      <ProfileRequiredModal
        open={isProfileModalOpen}
        onClose={closeAuthModal}
      />
    </>
  );
};

export default CustomerQuotesPageClient;
