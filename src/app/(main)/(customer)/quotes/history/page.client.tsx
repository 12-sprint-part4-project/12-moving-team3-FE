'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { Button } from '@/components/Button/Button';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useAuth } from '@/hooks/useAuth';
import {
  HISTORY_PAST_QUOTE_GROUP_LIMIT,
  useCustomerPastQuotes,
} from '@/hooks/useCustomerPastQuotes';
import { ApiError } from '@/lib/apiClient';
import { cn } from '@/lib/utils';

import { PendingQuotesEmptyState } from '../_components/PendingQuotesEmptyState';
import { HistoryQuoteCard } from './_components/HistoryQuoteCard';

const PAGE_X_PADDING =
  'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

const CONTENT_CLASS = `mx-auto w-full max-w-[1920px] py-6 md:py-8 lg:py-10 ${PAGE_X_PADDING}`;

/** 고객 이용 내역 */
const CustomerQuoteHistoryPageClient = () => {
  const { user, isReady } = useAuth();
  const isLoggedIn = Boolean(user);

  const {
    historyCards,
    isHistoryEmpty,
    isPending,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useCustomerPastQuotes({
    limit: HISTORY_PAST_QUOTE_GROUP_LIMIT,
    filter: 'CONFIRMED',
    enabled: isLoggedIn,
  });

  const { ref: loadMoreRef, inView } = useInView({
    rootMargin: '200px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : '이용 내역을 불러오지 못했습니다.';

  if (!isReady || !user) {
    return (
      <div className="flex min-h-full w-full items-center justify-center bg-background-200">
        <Spinner message="로딩 중..." />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden">
      <div
        className={cn(
          'shrink-0 border-b border-line-100 bg-white py-4 shadow-page-title md:py-6 lg:py-8',
          PAGE_X_PADDING
        )}
      >
        <h1 className="text-2lg-semibold text-black-400 lg:text-2xl-semibold">
          이용 내역
        </h1>
      </div>

      <div className="min-h-0 w-full flex-1 bg-background-200">
        {isPending ? (
          <div className={CONTENT_CLASS}>
            <Spinner message="목록 불러오는 중..." />
          </div>
        ) : null}

        {isError ? (
          <div className={CONTENT_CLASS}>
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
                onClick={() => {
                  void refetch();
                }}
              >
                다시 시도
              </Button>
            </div>
          </div>
        ) : null}

        {!isPending && !isError && isHistoryEmpty ? (
          <div className={CONTENT_CLASS}>
            <PendingQuotesEmptyState variant="historyEmpty" />
          </div>
        ) : null}

        {!isPending && !isError && !isHistoryEmpty ? (
          <div className={CONTENT_CLASS}>
            <ul className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-12">
              {historyCards.map((quote) => (
                <li key={quote.quoteId}>
                  <HistoryQuoteCard quote={quote} />
                </li>
              ))}
            </ul>

            <div ref={loadMoreRef} className="flex w-full justify-center py-2">
              {isFetchingNextPage ? (
                <Spinner message="더 불러오는 중..." />
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CustomerQuoteHistoryPageClient;
