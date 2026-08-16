'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { ResponsivePagination } from '@/components/ui/Pagination';
import {
  fadeIn,
  fadeUp,
  getMotionTransition,
  listStagger,
} from '@/lib/motionVariants';

import type { ReactNode } from 'react';

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
  pagination: ReviewListPagination<T>;
  renderItem: (item: T) => ReactNode;
}

/**
 * 이사 리뷰 탭 목록 레이아웃.
 * 그리드·재조회 오버레이·반응형 페이지네이션만 담당한다.
 * 목록이 짧을 때도 페이지네이션은 패널 하단에 붙는다 (mt-auto).
 */
export const ReviewListSection = <T,>({
  items,
  pagination,
  renderItem,
}: ReviewListSectionProps<T>) => {
  const {
    page,
    totalPages,
    onPageChange,
    isFetching = false,
    getItemKey,
  } = pagination;

  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const showListFetching = isFetching && items.length > 0;
  const shouldAnimateList = !showListFetching;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
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
    </div>
  );
};
