'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { QuotesListErrorState } from '@/components/quotes/QuotesListErrorState';
import { ResponsivePagination } from '@/components/ui/Pagination';
import { QuotesListSkeleton } from '@/components/ui/Skeleton';
import { useMoverQuotes } from '@/hooks/useMoverQuotes';
import { resolveApiErrorMessage } from '@/lib/apiClient';
import {
  getFadeInMotionProps,
  getFadeInPresenceProps,
  getFadeUpMotionProps,
  getListStagger,
  getMotionTransition,
} from '@/lib/motionVariants';

import { MOVER_QUOTES_CONTENT_CLASS } from './moverQuotesStyles';
import { QuotesEmptyState } from './QuotesEmptyState';
import { RejectedQuoteCard } from './RejectedQuoteCard';
import { SentQuoteCard } from './SentQuoteCard';

import type {
  QuoteListStatus,
  RejectedQuoteCardModel,
  SentQuoteCardModel,
} from '@/types/quote';

interface MoverQuotesListPanelProps {
  status: QuoteListStatus;
}

/** `/mover/quotes` 탭 본문. - 목록 Query·페이지네이션. */
export const MoverQuotesListPanel = ({ status }: MoverQuotesListPanelProps) => {
  const shouldReduceMotion = useReducedMotion();

  const [page, setPage] = useState(1);
  /** 페이지네이션으로만 목록 entrance stagger (탭 전환은 슬라이드만) */
  const [staggerOnPageChange, setStaggerOnPageChange] = useState(false);

  const {
    quotes,
    totalPages,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
    isEmpty,
  } = useMoverQuotes({ status, page });

  const motionTransition = getMotionTransition(shouldReduceMotion);
  const fadeInMotion = getFadeInMotionProps(motionTransition);
  const fadeInPresence = getFadeInPresenceProps(motionTransition);
  const fadeUpMotion = getFadeUpMotionProps(motionTransition);
  const listStaggerVariants = getListStagger(shouldReduceMotion);
  const errorMessage = resolveApiErrorMessage(
    error,
    '견적 목록을 불러오지 못했습니다.'
  );

  const showListFetching = isFetching && !isPending;
  const shouldAnimateList = staggerOnPageChange && !showListFetching;

  /** 총 페이지 감소 시 표시·페이지네이션은 범위 안 값을 쓰고, 상태는 effect에서 맞춤 */
  const effectivePage = totalPages > 0 && page > totalPages ? totalPages : page;

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      // 렌더 중 setState 대신 총 페이지 감소 시에만 page를 범위 안으로 맞춤
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handlePageChange = (nextPage: number) => {
    setStaggerOnPageChange(true);
    setPage(nextPage);
  };

  const handleRetry = () => {
    void refetch();
  };

  // 로딩 — 목록 스켈레톤
  if (isPending) {
    return (
      <div className={MOVER_QUOTES_CONTENT_CLASS}>
        <QuotesListSkeleton />
      </div>
    );
  }

  // 에러 — 재시도
  if (isError) {
    return (
      <div className={MOVER_QUOTES_CONTENT_CLASS}>
        <QuotesListErrorState
          message={errorMessage}
          onRetry={handleRetry}
          withMotion={false}
        />
      </div>
    );
  }

  // 본문 — 빈 상태 또는 카드 그리드 + 페이지네이션
  return (
    <div className={MOVER_QUOTES_CONTENT_CLASS}>
      {isEmpty ? (
        <QuotesEmptyState status={status} />
      ) : (
        <div
          className="flex w-full flex-col gap-8 lg:gap-12"
          aria-busy={showListFetching}
        >
          <div className="relative">
            <AnimatePresence>
              {showListFetching ? (
                <motion.div
                  {...fadeInPresence}
                  className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-background-200/50"
                  aria-hidden
                />
              ) : null}
            </AnimatePresence>

            <motion.ul
              key={
                shouldAnimateList
                  ? `${status}-${effectivePage}`
                  : `static-${status}-${effectivePage}`
              }
              variants={shouldAnimateList ? listStaggerVariants : undefined}
              initial={shouldAnimateList ? 'hidden' : false}
              animate={shouldAnimateList ? 'show' : undefined}
              className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-12"
            >
              {status === 'SENT'
                ? (quotes as SentQuoteCardModel[]).map((quote) => (
                    <motion.li key={quote.id} {...fadeUpMotion}>
                      <SentQuoteCard quote={quote} />
                    </motion.li>
                  ))
                : (quotes as RejectedQuoteCardModel[]).map((quote) => (
                    <motion.li key={quote.id} {...fadeUpMotion}>
                      <RejectedQuoteCard quote={quote} />
                    </motion.li>
                  ))}
            </motion.ul>
          </div>

          {totalPages > 1 ? (
            <motion.div
              {...fadeInMotion}
              className="flex w-full flex-col items-center"
            >
              <ResponsivePagination
                page={effectivePage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                scrollOnPageChange
              />
            </motion.div>
          ) : null}
        </div>
      )}
    </div>
  );
};
