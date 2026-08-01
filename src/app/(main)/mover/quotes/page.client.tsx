'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/Button/Button';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { Tab } from '@/components/ui/Tab/Tab';
import { useMoverQuotes } from '@/hooks/useMoverQuotes';
import { ApiError } from '@/lib/apiClient';
import type {
  QuoteListStatus,
  RejectedQuoteCardModel,
  SentQuoteCardModel,
} from '@/types/quote';

import { QuotesEmptyState } from './_components/QuotesEmptyState';
import { RejectedQuoteCard } from './_components/RejectedQuoteCard';
import { SentQuoteCard } from './_components/SentQuoteCard';

type QuotesTabId = 'sent' | 'rejected';

const TAB_TO_STATUS: Record<QuotesTabId, QuoteListStatus> = {
  sent: 'SENT',
  rejected: 'REJECTED',
};

const TABS: { id: QuotesTabId; label: string }[] = [
  { id: 'sent', label: '보낸 견적 조회' },
  { id: 'rejected', label: '반려 요청' },
];

/** 탭 id 유효성 판별 */
const isQuotesTabId = (value: string): value is QuotesTabId =>
  value === 'sent' || value === 'rejected';

/** 내 견적 관리 페이지 클라이언트 — 보낸 견적 / 반려 요청 탭 목록 */
const MoverQuotesPageClient = () => {
  const [activeTab, setActiveTab] = useState<QuotesTabId>('sent');
  const [page, setPage] = useState(1);
  const listStatus = TAB_TO_STATUS[activeTab];

  const {
    quotes,
    totalPages,
    currentPage,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
    isEmpty,
  } = useMoverQuotes({ status: listStatus, page });

  /** 총 페이지 감소 시 현재 페이지를 범위 안으로 보정 */
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  /** 에러 메시지 결정 */
  const errorMessage =
    error instanceof ApiError
      ? error.message
      : '견적 목록을 불러오지 못했습니다.';

  /** 탭 변경 시 1페이지로 초기화 */
  const handleTabChange = (tabId: string) => {
    if (!isQuotesTabId(tabId) || tabId === activeTab) {
      return;
    }
    setActiveTab(tabId);
    setPage(1);
  };

  /** 페이지 변경 */
  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  /** 목록 재조회 */
  const handleRetry = () => {
    void refetch();
  };

  /** 페이지 가로 패딩 클래스 정의 */
  const pageXPadding =
    'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

  const showPageFetching = isFetching && !isPending;

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden">
      {/* 보낸 견적 / 반려 요청 탭 렌더 */}
      <div
        className={`shrink-0 border-b border-line-100 bg-white pt-4 shadow-page-title ${pageXPadding}`}
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
              id={`quotes-tab-${tab.id}`}
              aria-controls={`quotes-panel-${tab.id}`}
            >
              {tab.label}
            </Tab>
          ))}
        </div>
      </div>
      <div className="min-h-0 w-full flex-1 bg-background-200">
        <div
          className={`mx-auto w-full max-w-[1920px] py-6 md:py-8 lg:py-10 ${pageXPadding}`}
          role="tabpanel"
          id={`quotes-panel-${activeTab}`}
          aria-labelledby={`quotes-tab-${activeTab}`}
        >
          {isPending ? (
            <Spinner message="목록 불러오는 중..." />
          ) : isError ? (
            <div className="flex flex-col items-center gap-4 py-16">
              <p
                role="alert"
                className="text-center text-lg-medium text-red-200"
              >
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
          ) : isEmpty ? (
            <QuotesEmptyState status={listStatus} />
          ) : (
            <div
              className={`flex w-full flex-col gap-8 lg:gap-12 ${showPageFetching ? 'opacity-60' : ''}`}
              aria-busy={showPageFetching}
            >
              {/* 카드 목록 — 모바일·태블릿 1열 / 데스크톱 2열 */}
              <ul className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-12">
                {activeTab === 'sent'
                  ? (quotes as SentQuoteCardModel[]).map((quote) => (
                      <li key={quote.id}>
                        <SentQuoteCard quote={quote} />
                      </li>
                    ))
                  : (quotes as RejectedQuoteCardModel[]).map((quote) => (
                      <li key={quote.id}>
                        <RejectedQuoteCard quote={quote} />
                      </li>
                    ))}
              </ul>

              {/* 페이지네이션 — 2페이지 이상일 때만 표시 */}
              {totalPages > 1 ? (
                <div className="flex w-full flex-col items-center">
                  {/* 모바일·태블릿 sm / 데스크톱 lg */}
                  <div className="flex justify-center lg:hidden">
                    <Pagination
                      size="sm"
                      page={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                  <div className="hidden justify-center lg:flex">
                    <Pagination
                      size="lg"
                      page={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoverQuotesPageClient;
