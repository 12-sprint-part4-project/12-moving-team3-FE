'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { Button } from '@/components/Button/Button';
import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { Tab } from '@/components/ui/Tab/Tab';
import { useConfirmQuoteModal } from '@/hooks/useConfirmQuoteModal';
import {
  PAST_QUOTE_GROUP_LIMIT,
  useCustomerPastQuotes,
} from '@/hooks/useCustomerPastQuotes';
import { useCustomerPendingQuotes } from '@/hooks/useCustomerPendingQuotes';
import { useFavoriteAction } from '@/hooks/useFavoriteAction';
import { ApiError } from '@/lib/apiClient';

import { ConfirmQuoteModal } from './_components/ConfirmQuoteModal';
import { PendingQuoteCard } from './_components/PendingQuoteCard';
import { PendingQuotesEmptyState } from './_components/PendingQuotesEmptyState';
import { PendingRequestSubHeader } from './_components/PendingRequestSubHeader';
import { ReceivedQuoteGroupSection } from './_components/ReceivedQuoteGroupSection';

type QuotesTabId = 'pending' | 'received';

const TABS: { id: QuotesTabId; label: string }[] = [
  { id: 'pending', label: '대기 중인 견적' },
  { id: 'received', label: '받았던 견적' },
];

const PAGE_X_PADDING = 'px-6 md:px-18 lg:px-10 xl:px-16 min-[90rem]:px-65';

const CONTENT_CLASS = `mx-auto w-full max-w-[1920px] py-6 md:py-8 lg:py-10 ${PAGE_X_PADDING}`;

/** URL tab 쿼리 → 탭 id */
const parseQuotesTabId = (value: string | null): QuotesTabId =>
  value === 'received' ? 'received' : 'pending';

/** 탭 id 유효성 판별 */
const isQuotesTabId = (value: string): value is QuotesTabId =>
  value === 'pending' || value === 'received';

/** 고객 내 견적 관리 페이지 클라이언트 */
const CustomerQuotesPageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = parseQuotesTabId(searchParams.get('tab'));
  const {
    handleFavoriteClick,
    isMoverPending,
    isLoginModalOpen,
    closeLoginModal,
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

  /** 탭 변경 */
  const handleTabChange = (tabId: string) => {
    if (!isQuotesTabId(tabId) || tabId === activeTab) {
      return;
    }
    router.replace(tabId === 'received' ? '/quotes?tab=received' : '/quotes', {
      scroll: false,
    });
  };

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
          <Spinner message="목록 불러오는 중..." />
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
          <Spinner message="목록 불러오는 중..." />
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
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden">
      {/* 대기 중 / 받았던 견적 탭 */}
      <div
        className={`shrink-0 border-b border-line-100 bg-white pt-4 shadow-page-title ${PAGE_X_PADDING}`}
      >
        <div
          role="tablist"
          aria-label="내 견적 관리 탭"
          className="flex items-start gap-6 lg:gap-8"
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.id}
              variant="depth"
              active={activeTab === tab.id}
              onClick={() => handleTabChange(tab.id)}
              id={`customer-quotes-tab-${tab.id}`}
              aria-controls={`customer-quotes-panel-${tab.id}`}
            >
              {tab.label}
            </Tab>
          ))}
        </div>
      </div>

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

      <LoginRequiredModal open={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
};

export default CustomerQuotesPageClient;
