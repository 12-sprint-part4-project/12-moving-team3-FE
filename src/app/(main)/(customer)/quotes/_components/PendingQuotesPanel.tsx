'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { QuotesListErrorState } from '@/components/quotes/QuotesListErrorState';
import {
  PendingRequestSubHeaderSkeleton,
  QuotesListSkeleton,
} from '@/components/ui/Skeleton';
import { useCustomerPendingQuotes } from '@/hooks/useCustomerPendingQuotes';
import { useListEntranceStagger } from '@/hooks/useListEntranceStagger';
import { useStartEstimateChat } from '@/hooks/useStartEstimateChat';
import { ApiError } from '@/lib/apiClient';
import { fadeUp, getMotionTransition, listStagger } from '@/lib/motionVariants';
import { toStartEstimateChatParams } from '@/lib/startEstimateChat';
import type { PendingQuoteCardModel } from '@/types/customerQuote';

import { CUSTOMER_QUOTES_CONTENT_CLASS } from './customerQuotesLayout';
import { PendingQuoteCard } from './PendingQuoteCard';
import { PendingQuotesEmptyState } from './PendingQuotesEmptyState';
import { PendingRequestSubHeader } from './PendingRequestSubHeader';

interface PendingQuotesPanelProps {
  enabled: boolean;
  isConfirming: boolean;
  confirmingQuoteId: number | null;
  onConfirm: (quoteId: number) => void;
  onFavoriteClick: (moverId: string, nextFavorited: boolean) => void;
  isMoverPending: (moverId: string) => boolean;
}

/** 대기 중인 견적 탭 본문. 목록 조회·채팅 시작·카드 렌더를 담당한다. */
export const PendingQuotesPanel = ({
  enabled,
  isConfirming,
  confirmingQuoteId,
  onConfirm,
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

  const { startEstimateChat, isChatPending } = useStartEstimateChat();
  const [pendingChatQuoteId, setPendingChatQuoteId] = useState<number | null>(
    null
  );
  const staggerPendingList = useListEntranceStagger(isPending);
  const errorMessage =
    error instanceof ApiError
      ? error.message
      : '견적 목록을 불러오지 못했습니다.';

  useEffect(() => {
    if (!isChatPending) {
      setPendingChatQuoteId(null);
    }
  }, [isChatPending]);

  const handleRetry = () => {
    void refetch();
  };

  const handleChatClick = (quote: PendingQuoteCardModel) => {
    setPendingChatQuoteId(quote.quoteId);
    startEstimateChat(toStartEstimateChatParams(quote, quote.mover.moverId));
  };

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

  if (hasNoActiveRequest) {
    return (
      <div className={CUSTOMER_QUOTES_CONTENT_CLASS}>
        <PendingQuotesEmptyState variant="noRequest" />
      </div>
    );
  }

  return (
    <>
      {summary ? <PendingRequestSubHeader summary={summary} /> : null}
      <div className={CUSTOMER_QUOTES_CONTENT_CLASS}>
        {isWaitingForQuotes ? (
          <PendingQuotesEmptyState variant="waiting" />
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
                  isConfirming={isConfirming}
                  isConfirmingThis={confirmingQuoteId === quote.quoteId}
                  isChatPending={pendingChatQuoteId === quote.quoteId}
                  onConfirm={onConfirm}
                  onChatClick={handleChatClick}
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
