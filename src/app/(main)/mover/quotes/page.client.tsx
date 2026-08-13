'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { QuotesListErrorState } from '@/components/quotes/QuotesListErrorState';
import { QuotesListSkeleton } from '@/components/quotes/QuotesPageSkeleton';
import { Pagination } from '@/components/ui/Pagination';
import { useMoverQuotes } from '@/hooks/useMoverQuotes';
import { ApiError } from '@/lib/apiClient';
import {
  fadeIn,
  fadeUp,
  getMotionTransition,
  listStagger,
  tabContentSlide,
} from '@/lib/motionVariants';
import type {
  QuoteListStatus,
  RejectedQuoteCardModel,
  SentQuoteCardModel,
} from '@/types/quote';

import { QuotesEmptyState } from './_components/QuotesEmptyState';
import {
  MOVER_QUOTES_PAGE_X_PADDING,
  parseMoverQuotesTabId,
  type MoverQuotesTabId,
} from './_components/MoverQuotesTabs';
import { RejectedQuoteCard } from './_components/RejectedQuoteCard';
import { SentQuoteCard } from './_components/SentQuoteCard';

const TAB_TO_STATUS: Record<MoverQuotesTabId, QuoteListStatus> = {
  sent: 'SENT',
  rejected: 'REJECTED',
};

const CONTENT_CLASS = `mx-auto w-full max-w-[1920px] py-6 md:py-8 lg:py-10 ${MOVER_QUOTES_PAGE_X_PADDING}`;

/** 내 견적 관리 본문 — 보낸 견적 / 반려 요청 목록 */
const MoverQuotesPageClient = () => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const searchParams = useSearchParams();
  const activeTab = parseMoverQuotesTabId(searchParams.get('tab'));
  const [page, setPage] = useState(1);
  const [pageTab, setPageTab] = useState(activeTab);
  /** 페이지네이션으로만 목록 entrance stagger (탭 전환은 슬라이드만) */
  const [staggerOnPageChange, setStaggerOnPageChange] = useState(false);
  const listStatus = TAB_TO_STATUS[activeTab];

  /** 탭이 바뀌면 1페이지로 초기화 */
  if (pageTab !== activeTab) {
    setPageTab(activeTab);
    setPage(1);
    setStaggerOnPageChange(false);
  }

  const {
    quotes,
    totalPages,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
    isEmpty,
  } = useMoverQuotes({ status: listStatus, page });

  /** 총 페이지 감소 시 현재 페이지를 범위 안으로 보정 */
  if (totalPages > 0 && page > totalPages) {
    setPage(totalPages);
  }

  /** 에러 메시지 추출 */
  const errorMessage =
    error instanceof ApiError
      ? error.message
      : '견적 목록을 불러오지 못했습니다.';

  /** 페이지 변경 */
  const handlePageChange = (nextPage: number) => {
    setStaggerOnPageChange(true);
    setPage(nextPage);
  };

  /** 목록 재조회 */
  const handleRetry = () => {
    void refetch();
  };

  const showListFetching = isFetching && !isPending;
  const shouldAnimateList = staggerOnPageChange && !showListFetching;
  const tabDirection = activeTab === 'rejected' ? 1 : -1;

  const renderList = () => {
    if (isPending) {
      return <QuotesListSkeleton />;
    }

    if (isError) {
      return (
        <QuotesListErrorState message={errorMessage} onRetry={handleRetry} />
      );
    }

    if (isEmpty) {
      return <QuotesEmptyState status={listStatus} />;
    }

    return (
      <div
        className="flex w-full flex-col gap-8 lg:gap-12"
        aria-busy={showListFetching}
      >
        <div className="relative">
          <AnimatePresence>
            {showListFetching ? (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="show"
                exit="exit"
                transition={motionTransition}
                className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-background-200/50"
                aria-hidden
              />
            ) : null}
          </AnimatePresence>

          <motion.ul
            key={
              shouldAnimateList
                ? `${activeTab}-${page}`
                : `static-${activeTab}-${page}`
            }
            variants={shouldAnimateList ? listStagger : undefined}
            initial={shouldAnimateList ? 'hidden' : false}
            animate={shouldAnimateList ? 'show' : undefined}
            className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-12"
          >
            {activeTab === 'sent'
              ? (quotes as SentQuoteCardModel[]).map((quote) => (
                  <motion.li
                    key={quote.id}
                    variants={fadeUp}
                    transition={motionTransition}
                  >
                    <SentQuoteCard quote={quote} />
                  </motion.li>
                ))
              : (quotes as RejectedQuoteCardModel[]).map((quote) => (
                  <motion.li
                    key={quote.id}
                    variants={fadeUp}
                    transition={motionTransition}
                  >
                    <RejectedQuoteCard quote={quote} />
                  </motion.li>
                ))}
          </motion.ul>
        </div>

        {totalPages > 1 ? (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            transition={motionTransition}
            className="flex w-full flex-col items-center"
          >
            <div className="flex justify-center lg:hidden">
              <Pagination
                size="sm"
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                scrollOnPageChange
              />
            </div>
            <div className="hidden justify-center lg:flex">
              <Pagination
                size="lg"
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                scrollOnPageChange
              />
            </div>
          </motion.div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden bg-background-200">
      <AnimatePresence mode="wait" custom={tabDirection}>
        <motion.div
          key={activeTab}
          custom={tabDirection}
          variants={tabContentSlide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={motionTransition}
          role="tabpanel"
          id={`quotes-panel-${activeTab}`}
          aria-labelledby={`quotes-tab-${activeTab}`}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className={CONTENT_CLASS}>{renderList()}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MoverQuotesPageClient;
