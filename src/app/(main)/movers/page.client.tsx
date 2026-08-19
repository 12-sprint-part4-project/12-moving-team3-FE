'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { ProfileRequiredModal } from '@/components/auth/ProfileRequiredModal';
import { useAuth } from '@/hooks/useAuth';
import { useFavoriteAction } from '@/hooks/useFavoriteAction';
import { useFavoriteMoversPreview } from '@/hooks/useFavoriteMoversPreview';
import { fadeUp, getMotionTransition } from '@/lib/motionVariants';

import { MOVERS_LIST_CONTENT_CLASS } from './_components/moversLayout';
import { MoversListPanel } from './_components/MoversListPanel';
import { MoversSidebar } from './_components/MoversSidebar';
import { MoversToolbar } from './_components/MoversToolbar';
import { useMoversFilters } from './_lib/useMoversFilters';

/** `/movers` 클라이언트. - 필터·목록 Query, 무한스크롤, 찜 오케스트레이션. */
const MoversPageClient = () => {
  const shouldReduceMotion = useReducedMotion();
  const { user } = useAuth();
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

  const canUseFavorites = Boolean(user?.isProfileCompleted);
  const { favorites } = useFavoriteMoversPreview(canUseFavorites);

  const isLoggedIn = Boolean(user);
  const motionTransition = getMotionTransition(shouldReduceMotion);

  return (
    <>
      <div className={MOVERS_LIST_CONTENT_CLASS}>
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

          <MoversListPanel
            debouncedSearch={debouncedSearch}
            regions={selectedRegions}
            moveTypes={selectedMoveTypes}
            sort={sortValue}
            filters={filters}
            onResetAll={handleResetAll}
            onFavoriteClick={handleFavoriteClick}
            isMoverPending={isMoverPending}
          />
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
