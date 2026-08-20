'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

import { MoverCard } from '@/components/movers/MoverCard';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useLoadMoreOnView } from '@/hooks/useLoadMoreOnView';
import { useMoversList } from '@/hooks/useMoversList';
import { resolveApiErrorMessage } from '@/lib/apiClient';
import {
  fadeIn,
  fadeUp,
  getMotionTransition,
  listStagger,
} from '@/lib/motionVariants';

import { MoversListStatus } from './MoversListStatus';

import type { MoversFilters } from '../_lib/moversFilters';
import type { ApiMoveType, ApiRegion, MoversSortValue } from '@/types/mover';

export interface MoversListPanelProps {
  debouncedSearch: string;
  regions: ApiRegion[];
  moveTypes: ApiMoveType[];
  sort: MoversSortValue;
  filters: MoversFilters;
  onResetAll: () => void;
  onFavoriteClick: (moverId: string, nextFavorited: boolean) => void;
  isMoverPending: (moverId: string) => boolean;
}

/** `/movers` 목록 패널. Query·배타 가드·stagger·무한스크롤. */
export const MoversListPanel = ({
  debouncedSearch,
  regions,
  moveTypes,
  sort,
  filters,
  onResetAll,
  onFavoriteClick,
  isMoverPending,
}: MoversListPanelProps) => {
  const shouldReduceMotion = useReducedMotion();

  const {
    movers,
    isPending,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
    isEmpty,
    refetch,
  } = useMoversList({
    keyword: debouncedSearch,
    regions,
    moveTypes,
    sort,
  });

  const loadMoreRef = useLoadMoreOnView({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    rootMargin: '200px',
  });

  const listAnimationKey = useMemo(
    () => [sort, filters.regionValue, filters.serviceValue].join('|'),
    [sort, filters.regionValue, filters.serviceValue]
  );

  const motionTransition = getMotionTransition(shouldReduceMotion);
  const showListFetching = isFetching && !isPending && !isFetchingNextPage;
  const shouldAnimateList = !showListFetching;

  const isFilteredEmpty =
    isEmpty &&
    (debouncedSearch.trim() !== '' ||
      filters.regionValue !== 'ALL' ||
      filters.serviceValue !== 'ALL');

  const errorMessage = resolveApiErrorMessage(
    error,
    '기사님 목록을 불러오지 못했습니다.'
  );

  const handleRetry = () => {
    void refetch();
  };

  //로딩·에러·empty.
  if (isPending || isError || isEmpty) {
    return (
      <MoversListStatus
        isPending={isPending}
        isError={isError}
        errorMessage={errorMessage}
        onRetry={handleRetry}
        onResetEmpty={isFilteredEmpty ? onResetAll : undefined}
      />
    );
  }

  return (
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
              className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-white/40"
              aria-hidden
            />
          ) : null}
        </AnimatePresence>

        <motion.ul
          key={listAnimationKey}
          variants={shouldAnimateList ? listStagger : undefined}
          initial={shouldAnimateList ? 'hidden' : false}
          animate={shouldAnimateList ? 'show' : undefined}
          className="flex flex-col gap-6 xl:gap-12"
        >
          {movers.map((mover) => (
            <motion.li
              key={mover.moverId}
              variants={fadeUp}
              transition={motionTransition}
              initial={false}
              animate="show"
            >
              <MoverCard
                mover={mover}
                size="lg"
                onFavoriteClick={onFavoriteClick}
                isFavoritePending={isMoverPending(mover.moverId)}
              />
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {hasNextPage || isFetchingNextPage ? ( //새로운 페이지를 불러올 때, 스피너.
        <div ref={loadMoreRef} className="flex w-full justify-center py-6">
          <AnimatePresence>
            {isFetchingNextPage ? (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="show"
                exit="exit"
                transition={motionTransition}
              >
                <Spinner message="더 불러오는 중..." className="py-4" />
              </motion.div>
            ) : (
              <span className="sr-only">스크롤하여 더 보기</span>
            )}
          </AnimatePresence>
        </div>
      ) : null}
    </>
  );
};
