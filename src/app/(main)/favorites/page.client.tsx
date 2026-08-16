'use client';

import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { ProfileRequiredModal } from '@/components/auth/ProfileRequiredModal';
import { useFavoriteAction } from '@/hooks/useFavoriteAction';
import { cn } from '@/lib/utils';

import { FAVORITES_PAGE_X_PADDING } from './_components/favoritesLayout';
import { FavoritesListPanel } from './_components/FavoritesListPanel';

/** `/favorites` 클라이언트. - 찜 목록·모달 오케스트레이션. */
const FavoritesPageClient = () => {
  const {
    handleFavoriteClick,
    isMoverPending,
    isLoginModalOpen,
    isProfileModalOpen,
    closeAuthModal,
  } = useFavoriteAction();

  return (
    <>
      <div className="min-h-0 w-full flex-1 bg-background-200">
        <div
          className={cn(
            'mx-auto flex w-full max-w-[1920px] flex-col py-6 md:py-8',
            FAVORITES_PAGE_X_PADDING
          )}
        >
          <FavoritesListPanel
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

export default FavoritesPageClient;
