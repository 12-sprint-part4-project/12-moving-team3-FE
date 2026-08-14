'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { ResponsivePagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import {
  fadeIn,
  fadeUp,
  getMotionTransition,
  listStagger,
} from '@/lib/motionVariants';

import type { ReactNode } from 'react';

export interface ReviewListStatus {
  isPending: boolean;
  isError: boolean;
  showEmpty: boolean;
  pendingMessage: string;
  errorMessage: string;
  onRetry: () => void;
  emptyState: ReactNode;
}

export interface ReviewListPagination<T = unknown> {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** keepPreviousData 재조회 중 — 목록 stagger를 잠시 끈다 */
  isFetching?: boolean;
  getItemKey?: (item: T) => string | number;
}

export interface ReviewListSectionProps<T> {
  items: T[];
  status: ReviewListStatus;
  pagination: ReviewListPagination<T>;
  renderItem: (item: T) => ReactNode;
}

/**
 * 이사 리뷰 탭 목록 공통 레이아웃.
 * 스피너·에러·empty·그리드·반응형 페이지네이션을 한곳에서 렌더한다.
 * 목록이 짧을 때도 페이지네이션은 패널 하단에 붙는다 (mt-auto).
 */
export const ReviewListSection = <T,>({
  items,
  status,
  pagination,
  renderItem,
}: ReviewListSectionProps<T>) => {
  const {
    isPending,
    isError,
    showEmpty,
    pendingMessage,
    errorMessage,
    onRetry,
    emptyState,
  } = status;
  const {
    page,
    totalPages,
    onPageChange,
    isFetching = false,
    getItemKey,
  } = pagination;

  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const showListFetching = isFetching && !isPending && items.length > 0;
  const shouldAnimateList = !showListFetching;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {isPending && items.length === 0 ? (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={motionTransition}
        >
          <Spinner message={pendingMessage} />
        </motion.div>
      ) : null}

      {isError ? (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={motionTransition}
          className="flex flex-col items-start gap-3 py-10"
        >
          <p className="text-md-medium text-gray-400">{errorMessage}</p>
          <button
            type="button"
            onClick={onRetry}
            className="text-md-semibold text-blue-300 underline"
          >
            다시 시도
          </button>
        </motion.div>
      ) : null}

      {!isError && showEmpty ? emptyState : null}

      {!isError && !showEmpty && items.length > 0 ? (
        <>
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

            <motion.div
              key={shouldAnimateList ? page : 'review-list'}
              variants={shouldAnimateList ? listStagger : undefined}
              initial={shouldAnimateList ? 'hidden' : false}
              animate={shouldAnimateList ? 'show' : undefined}
              className="grid grid-cols-1 gap-8 xl:grid-cols-2 xl:gap-x-6 xl:gap-y-10"
            >
              {items.map((item, index) => (
                <motion.div
                  key={getItemKey?.(item) ?? index}
                  variants={fadeUp}
                  transition={motionTransition}
                >
                  {renderItem(item)}
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            transition={motionTransition}
            className="mt-auto flex justify-center pt-6"
          >
            <ResponsivePagination
              breakpoint="xl"
              page={page}
              totalPages={Math.max(1, totalPages)}
              onPageChange={onPageChange}
              scrollOnPageChange
            />
          </motion.div>
        </>
      ) : null}
    </div>
  );
};
