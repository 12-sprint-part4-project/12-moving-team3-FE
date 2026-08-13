'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { Button } from '@/components/Button/Button';
import { QuotesHistoryPageSkeleton } from '@/components/quotes/QuotesPageSkeleton';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useAuth } from '@/hooks/useAuth';
import {
  HISTORY_PAST_QUOTE_GROUP_LIMIT,
  useCustomerPastQuotes,
} from '@/hooks/useCustomerPastQuotes';
import { ApiError } from '@/lib/apiClient';
import {
  fadeIn,
  fadeUp,
  getMotionTransition,
  listStagger,
} from '@/lib/motionVariants';

import { PendingQuotesEmptyState } from '../_components/PendingQuotesEmptyState';
import { HistoryQuoteCard } from './_components/HistoryQuoteCard';

const HISTORY_PAGE_X_PADDING =
  'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

const CONTENT_CLASS = `mx-auto w-full max-w-[1920px] py-6 md:py-8 lg:py-10 ${HISTORY_PAGE_X_PADDING}`;

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

  const showListSkeleton = !isReady || !user || isPending;

  if (showListSkeleton) {
    return (
      <QuotesHistoryPageSkeleton pageXPadding={HISTORY_PAGE_X_PADDING} />
    );
  }

  return (
    <div className="min-h-0 w-full flex-1 bg-background-200">
      {isError ? (
        <div className={CONTENT_CLASS}>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            transition={motionTransition}
            className="flex flex-col items-center gap-4 py-16"
          >
            <p role="alert" className="text-center text-lg-medium text-red-200">
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
          </motion.div>
        </div>
      ) : null}

      {!isError && isHistoryEmpty ? (
        <div className={CONTENT_CLASS}>
          <PendingQuotesEmptyState variant="historyEmpty" />
        </div>
      ) : null}

      {!isError && !isHistoryEmpty ? (
        <div className={CONTENT_CLASS}>
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

          <div ref={loadMoreRef} className="flex w-full justify-center py-2">
            <AnimatePresence>
              {isFetchingNextPage ? (
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  transition={motionTransition}
                >
                  <Spinner message="더 불러오는 중..." />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CustomerQuoteHistoryPageClient;
