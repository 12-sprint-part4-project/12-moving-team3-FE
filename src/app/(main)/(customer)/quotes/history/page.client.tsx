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
import { useStartEstimateChat } from '@/hooks/useStartEstimateChat';
import { resolveApiErrorMessage } from '@/lib/apiClient';
import { fadeUp, getMotionTransition, listStagger } from '@/lib/motionVariants';
import { toStartEstimateChatParams } from '@/lib/startEstimateChat';

import { CustomerQuotesEmptyState } from '../_components/CustomerQuotesEmptyState';
import {
  CUSTOMER_QUOTES_CONTENT_CLASS,
  CUSTOMER_QUOTES_PAGE_X_PADDING,
} from '../_components/customerQuotesLayout';
import { HistoryQuoteCard } from './_components/HistoryQuoteCard';

import type { HistoryQuoteCardModel } from '@/types/customerQuote';

/** `/quotes/history` 클라이언트. - 확정 견적 목록 */
const CustomerQuoteHistoryPageClient = () => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const { user, isReady } = useAuth();
  const isLoggedIn = Boolean(user);
  const { startEstimateChat, pendingChatTargetId } = useStartEstimateChat();

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
  const errorMessage = resolveApiErrorMessage(
    error,
    '이용 내역을 불러오지 못했습니다.'
  );

  const handleRetry = () => {
    void refetch();
  };

  /** 확정 기사와 1:1 채팅방 생성 후 이동 */
  const handleChatClick = (quote: HistoryQuoteCardModel) => {
    startEstimateChat(
      toStartEstimateChatParams(quote, quote.moverId),
      quote.quoteId
    );
  };

  // 로딩 — 이용 내역 스켈레톤
  if (!isReady || (isLoggedIn && isPending)) {
    return (
      <QuotesHistoryPageSkeleton
        pageXPadding={CUSTOMER_QUOTES_PAGE_X_PADDING}
      />
    );
  }

  // 비로그인 — AuthRouteGuard(LoginRequiredModal)가 처리
  if (!user) {
    return null;
  }

  // 에러 — 재시도
  if (isError) {
    return (
      <div className="min-h-0 w-full flex-1 bg-background-200">
        <div className={CUSTOMER_QUOTES_CONTENT_CLASS}>
          <QuotesListErrorState message={errorMessage} onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  // 빈 상태 — 이용 내역 없음
  if (isHistoryEmpty) {
    return (
      <div className="min-h-0 w-full flex-1 bg-background-200">
        <div className={CUSTOMER_QUOTES_CONTENT_CLASS}>
          <CustomerQuotesEmptyState variant="historyEmpty" />
        </div>
      </div>
    );
  }

  // 본문 — 확정 견적 카드 그리드 + 무한스크롤
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
              <HistoryQuoteCard
                quote={quote}
                isChatPending={pendingChatTargetId === quote.quoteId}
                onChatClick={() => handleChatClick(quote)}
              />
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
