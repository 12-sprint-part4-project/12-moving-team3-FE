'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { QuotesListErrorState } from '@/components/quotes/QuotesListErrorState';
import {
  PendingRequestSubHeaderSkeleton,
  QuotesListSkeleton,
} from '@/components/ui/Skeleton';
import { useCustomerPendingQuotes } from '@/hooks/useCustomerPendingQuotes';
import { useListEntranceStagger } from '@/hooks/useListEntranceStagger';
import { resolveApiErrorMessage } from '@/lib/apiClient';
import { fadeUp, getMotionTransition, listStagger } from '@/lib/motionVariants';
import { toMoverCardModelFromCustomerQuoteMover } from '@/services/customerQuoteApi';
import type { PendingQuoteCardModel } from '@/types/customerQuote';

import { CUSTOMER_QUOTES_CONTENT_CLASS } from './customerQuotesLayout';
import { CustomerQuotesEmptyState } from './CustomerQuotesEmptyState';
import { PendingQuoteCard } from './PendingQuoteCard';
import { PendingRequestSubHeader } from './PendingRequestSubHeader';

/** 대기 중인 견적 탭 패널 props */
interface PendingQuotesPanelProps {
  enabled: boolean;
  isConfirming: boolean;
  confirmingQuoteId: number | null;
  pendingChatQuoteId: number | null;
  onConfirm: (quoteId: number) => void;
  onChatClick: (quote: PendingQuoteCardModel) => void;
  onFavoriteClick: (moverId: string, nextFavorited: boolean) => void;
  isMoverPending: (moverId: string) => boolean;
}

/** `/quotes` 대기 탭 본문. - 목록 Query·서브헤더·카드 그리드. */
export const PendingQuotesPanel = ({
  enabled,
  isConfirming,
  confirmingQuoteId,
  pendingChatQuoteId,
  onConfirm,
  onChatClick,
  onFavoriteClick,
  isMoverPending,
}: PendingQuotesPanelProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const {
    quotes,
    summary,
    isWaitingForQuotes,
    hasNoActiveRequest,
    isPending,
    isError,
    error,
    refetch,
  } = useCustomerPendingQuotes({ enabled });

  const staggerPendingList = useListEntranceStagger(isPending);
  const errorMessage = resolveApiErrorMessage(
    error,
    '견적 목록을 불러오지 못했습니다.'
  );

  const handleRetry = () => {
    void refetch();
  };

  // 로딩 — 서브헤더·목록 스켈레톤
  if (isPending) {
    return (
      <>
        <PendingRequestSubHeaderSkeleton />
        <div className={CUSTOMER_QUOTES_CONTENT_CLASS}>
          <QuotesListSkeleton />
        </div>
      </>
    );
  }

  // 에러 — 재시도
  if (isError) {
    return (
      <div className={CUSTOMER_QUOTES_CONTENT_CLASS}>
        <QuotesListErrorState
          message={errorMessage}
          onRetry={handleRetry}
          withMotion={false}
        />
      </div>
    );
  }

  // 빈 상태 — 활성 요청 없음
  if (hasNoActiveRequest) {
    return (
      <div className={CUSTOMER_QUOTES_CONTENT_CLASS}>
        <CustomerQuotesEmptyState variant="noRequest" />
      </div>
    );
  }

  // 본문 — 요청 서브헤더 + 대기 카드 그리드(또는 waiting 빈 상태)
  return (
    <>
      {summary ? <PendingRequestSubHeader summary={summary} /> : null}
      <div className={CUSTOMER_QUOTES_CONTENT_CLASS}>
        {isWaitingForQuotes ? (
          <CustomerQuotesEmptyState variant="waiting" />
        ) : (
          <motion.ul
            variants={staggerPendingList ? listStagger : undefined}
            initial={staggerPendingList ? 'hidden' : false}
            animate={staggerPendingList ? 'show' : undefined}
            className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-8"
          >
            {quotes.map((quote) => (
              <motion.li
                key={quote.quoteId}
                variants={fadeUp}
                transition={motionTransition}
              >
                <PendingQuoteCard
                  quote={quote}
                  mover={toMoverCardModelFromCustomerQuoteMover(quote.mover)}
                  isConfirming={isConfirming}
                  isConfirmingThis={confirmingQuoteId === quote.quoteId}
                  isChatPending={pendingChatQuoteId === quote.quoteId}
                  onConfirm={onConfirm}
                  onChatClick={onChatClick}
                  onFavoriteClick={onFavoriteClick}
                  isFavoritePending={isMoverPending(quote.mover.moverId)}
                />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </>
  );
};
