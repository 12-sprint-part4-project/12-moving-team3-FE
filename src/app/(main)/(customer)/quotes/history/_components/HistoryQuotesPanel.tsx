'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { QuotesListErrorState } from '@/components/quotes/QuotesListErrorState';
import { QuotesLoadMoreSentinel } from '@/components/quotes/QuotesLoadMoreSentinel';
import { QuotesHistoryPageSkeleton } from '@/components/ui/Skeleton';
import {
  HISTORY_PAST_QUOTE_GROUP_LIMIT,
  useCustomerPastQuotes,
} from '@/hooks/useCustomerPastQuotes';
import { useLoadMoreOnView } from '@/hooks/useLoadMoreOnView';
import { resolveApiErrorMessage } from '@/lib/apiClient';
import { getFadeUpMotionProps, getListStagger, getMotionTransition } from '@/lib/motionVariants';

import { HistoryQuoteCard } from './HistoryQuoteCard';
import { CustomerQuotesEmptyState } from '../../_components/CustomerQuotesEmptyState';
import {
  CUSTOMER_QUOTES_CONTENT_CLASS,
  CUSTOMER_QUOTES_PAGE_X_PADDING,
} from '../../_components/customerQuotesStyles';

import type { HistoryQuoteCardModel } from '@/types/customerQuote';

/** 이용 내역 패널 props */
interface HistoryQuotesPanelProps {
  enabled: boolean;
  pendingChatQuoteId: number | null;
  onChatClick: (quote: HistoryQuoteCardModel) => void;
}

/** `/quotes/history` 본문. - 확정 견적 Query·무한스크롤. */
export const HistoryQuotesPanel = ({
  enabled,
  pendingChatQuoteId,
  onChatClick,
}: HistoryQuotesPanelProps) => {
  const shouldReduceMotion = useReducedMotion();

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
    enabled,
  });
  const loadMoreRef = useLoadMoreOnView({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const motionTransition = getMotionTransition(shouldReduceMotion);
  const listStaggerVariants = getListStagger(shouldReduceMotion);
  const fadeUpMotion = getFadeUpMotionProps(motionTransition);
  const errorMessage = resolveApiErrorMessage(
    error,
    '이용 내역을 불러오지 못했습니다.'
  );

  const handleRetry = () => {
    void refetch();
  };

  // 로딩 — 이용 내역 스켈레톤
  if (isPending) {
    return (
      <QuotesHistoryPageSkeleton
        pageXPadding={CUSTOMER_QUOTES_PAGE_X_PADDING}
      />
    );
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

  // 본문 — 빈 상태 또는 확정 견적 카드 그리드
  return (
    <div className="min-h-0 w-full flex-1 bg-background-200">
      <div className={CUSTOMER_QUOTES_CONTENT_CLASS}>
        {isHistoryEmpty ? (
          <CustomerQuotesEmptyState variant="historyEmpty" />
        ) : (
          <>
            <motion.ul
              variants={listStaggerVariants}
              initial="hidden"
              animate="show"
              className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-12"
            >
              {historyCards.map((quote) => (
                <motion.li key={quote.quoteId} {...fadeUpMotion}>
                  <HistoryQuoteCard
                    quote={quote}
                    pendingChatQuoteId={pendingChatQuoteId}
                    onChatClick={() => onChatClick(quote)}
                  />
                </motion.li>
              ))}
            </motion.ul>

            <QuotesLoadMoreSentinel
              loadMoreRef={loadMoreRef}
              isFetchingNextPage={isFetchingNextPage}
            />
          </>
        )}
      </div>
    </div>
  );
};
