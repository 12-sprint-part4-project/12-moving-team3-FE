'use client';

import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { ProfileRequiredModal } from '@/components/auth/ProfileRequiredModal';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useFavoriteAction } from '@/hooks/useFavoriteAction';

import { FAVORITES_CONTENT_CLASS } from './_components/favoritesLayout';
import { FavoritesListPanel } from './_components/FavoritesListPanel';

/** `/favorites` 클라이언트. - 인증 가드, 찜 목록 Query, 무한스크롤 오케스트레이션. */
const FavoritesPageClient = () => {
  const { user, isReady } = useAuth();
  const isLoggedIn = Boolean(user);
  const {
    handleFavoriteClick,
    isMoverPending,
    isLoginModalOpen,
    isProfileModalOpen,
    closeAuthModal,
  } = useFavoriteAction();

  if (!isReady || !user) {
    return (
      <div className="flex min-h-0 w-full flex-1 items-center justify-center bg-background-200">
        <Spinner message="로딩 중..." />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-0 w-full flex-1 bg-background-200">
        <div className={FAVORITES_CONTENT_CLASS}>
          <FavoritesListPanel
            enabled={isLoggedIn}
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
