'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { ProfileRequiredModal } from '@/components/auth/ProfileRequiredModal';
import { Button } from '@/components/Button/Button';
import { MoverCard } from '@/components/movers/MoverCard';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useFavoriteAction } from '@/hooks/useFavoriteAction';
import { useFavoriteMoversPreview } from '@/hooks/useFavoriteMoversPreview';
import { useLoadMoreOnView } from '@/hooks/useLoadMoreOnView';
import { useMoversList } from '@/hooks/useMoversList';
import { resolveApiErrorMessage } from '@/lib/apiClient';
import {
  fadeIn,
  fadeUp,
  getMotionTransition,
  listStagger,
} from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

import { MoversEmptyState } from './_components/MoversEmptyState';
import { MOVERS_PAGE_X_PADDING } from './_components/moversLayout';
import { MoversSidebar } from './_components/MoversSidebar';
import { MoversToolbar } from './_components/MoversToolbar';
import { useMoversFilters } from './_lib/useMoversFilters';

/** `/movers` 클라이언트. - 필터 Query, 무한스크롤, 찜 오케스트레이션. */
const MoversPageClient = () => {
  const shouldReduceMotion = useReducedMotion();
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);
  const canUseFavorites = Boolean(user?.isProfileCompleted);
  const {
    handleFavoriteClick,
    isMoverPending,
    isLoginModalOpen,
    isProfileModalOpen,
    closeAuthModal,
  } = useFavoriteAction();

  const {
    filters,
    filterActions,
    search,
    sort,
    selectedRegions,
    selectedMoveTypes,
    debouncedSearch,
    sortValue,
    handleResetAll,
  } = useMoversFilters();

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
    regions: selectedRegions,
    moveTypes: selectedMoveTypes,
    sort: sortValue,
  });

  const { favorites } = useFavoriteMoversPreview(canUseFavorites);

  const loadMoreRef = useLoadMoreOnView({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    rootMargin: '200px',
  });

  /** 정렬·필터 변경 시에만 목록 entrance 애니메이션 (검색어 제외) */
  const listAnimationKey = useMemo(
    () => [sortValue, filters.regionValue, filters.serviceValue].join('|'),
    [sortValue, filters.regionValue, filters.serviceValue]
  );

  const motionTransition = getMotionTransition(shouldReduceMotion);
  const showListFetching = isFetching && !isPending && !isFetchingNextPage;
  /**
   * 목록 entrance/stagger 애니메이션은 "펜딩 중(=기존 data 유지 + isFetching=true)"에는
   * 실행하지 않는다. 타이핑/필터 변경 시 목록이 계속 흔들리는 현상을 막기 위함이다.
   */
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

  return (
    <>
      <div
        className={cn(
          'mx-auto flex w-full max-w-[1920px] flex-col gap-6 py-6 md:py-8 xl:flex-row xl:items-start xl:gap-8 min-[90rem]:gap-12',
          MOVERS_PAGE_X_PADDING
        )}
      >
        <MoversSidebar
          className="hidden shrink-0 xl:flex"
          filters={filters}
          filterActions={filterActions}
          isLoggedIn={isLoggedIn}
          favoriteMovers={favorites}
          onFavoriteClick={handleFavoriteClick}
          isMoverPending={isMoverPending}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-6 lg:gap-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={motionTransition}
          >
            <MoversToolbar
              filters={filters}
              filterActions={filterActions}
              search={search}
              sort={sort}
            />
          </motion.div>

          {isPending ? (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="show"
              transition={motionTransition}
            >
              <Spinner message="기사님 목록을 불러오는 중..." />
            </motion.div>
          ) : isError ? (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="show"
              transition={motionTransition}
              className="flex flex-col items-center gap-4 py-16"
            >
              <p className="text-lg-medium text-gray-400">{errorMessage}</p>
              <Button
                type="button"
                variant="solid"
                size="sm"
                onClick={handleRetry}
                className="w-auto"
              >
                다시 시도
              </Button>
            </motion.div>
          ) : isEmpty ? (
            <MoversEmptyState
              onReset={isFilteredEmpty ? handleResetAll : undefined}
            />
          ) : (
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
                className="flex flex-col gap-6 lg:gap-12"
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
                      onFavoriteClick={handleFavoriteClick}
                      isFavoritePending={isMoverPending(mover.moverId)}
                    />
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          )}

          {hasNextPage || isFetchingNextPage ? (
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
        </div>
      </div>

      <LoginRequiredModal open={isLoginModalOpen} onClose={closeAuthModal} />
      <ProfileRequiredModal
        open={isProfileModalOpen}
        onClose={closeAuthModal}
      />
    </>
  );
};

export default MoversPageClient;
