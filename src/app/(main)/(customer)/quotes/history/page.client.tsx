'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { QuotesListErrorState } from '@/components/quotes/QuotesListErrorState';
import { QuotesLoadMoreSentinel } from '@/components/quotes/QuotesLoadMoreSentinel';
import { QuotesHistoryPageSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import {
  HISTORY_PAST_QUOTE_GROUP_LIMIT,
  useCustomerPastQuotes,
} from '@/hooks/useCustomerPastQuotes';
import { useLoadMoreOnView } from '@/hooks/useLoadMoreOnView';
import { ApiError } from '@/lib/apiClient';
import { fadeUp, getMotionTransition, listStagger } from '@/lib/motionVariants';

import {
  CUSTOMER_QUOTES_CONTENT_CLASS,
  CUSTOMER_QUOTES_PAGE_X_PADDING,
} from '../_components/customerQuotesLayout';
import { PendingQuotesEmptyState } from '../_components/PendingQuotesEmptyState';
import { HistoryQuoteCard } from './_components/HistoryQuoteCard';

/** 고객 이용 내역 */
const CustomerQuoteHistoryPageClient = () => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
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

  const loadMoreRef = useLoadMoreOnView({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });
  const errorMessage =
    error instanceof ApiError
      ? error.message
      : '이용 내역을 불러오지 못했습니다.';

  const handleRetry = () => {
    void refetch();
  };

  /** 인증 초기화·로그인 후 조회 중만 스켈레톤 (!user의 disabled isPending과 분리) */
  if (!isReady || (isLoggedIn && isPending)) {
    return (
      <QuotesHistoryPageSkeleton
        pageXPadding={CUSTOMER_QUOTES_PAGE_X_PADDING}
      />
    );
  }

  /** 비로그인 — AuthRouteGuard(LoginRequiredModal)가 처리 */
  if (!user) {
    return null;
  }

  if (isError) {
    return (
      <div className="min-h-0 w-full flex-1 bg-background-200">
        <div className={CUSTOMER_QUOTES_CONTENT_CLASS}>
          <QuotesListErrorState message={errorMessage} onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  if (isHistoryEmpty) {
    return (
      <div className="min-h-0 w-full flex-1 bg-background-200">
        <div className={CUSTOMER_QUOTES_CONTENT_CLASS}>
          <PendingQuotesEmptyState variant="historyEmpty" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 w-full flex-1 bg-background-200">
      <div className={CUSTOMER_QUOTES_CONTENT_CLASS}>
        <motion.ul
          variants={listStagger}
          initial="hidden"
          animate="show"
          className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-12"
        >
          {historyCards.map((quote) => (
            <motion.li
              key={quote.quoteId}
              variants={fadeUp}
              transition={motionTransition}
            >
              <HistoryQuoteCard quote={quote} />
            </motion.li>
          ))}
        </motion.ul>

        <QuotesLoadMoreSentinel
          loadMoreRef={loadMoreRef}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </div>
  );
};

export default CustomerQuoteHistoryPageClient;
