'use client';

import { useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useToggleFavorite } from '@/hooks/useToggleFavorite';

type AuthModalKind = 'login' | 'profile';

/**
 * 로그인·프로필 가드가 포함된 찜 토글.
 * 비회원 → 로그인 모달, 프로필 미완료 → 등록 모달, 그 외 → toggle.
 */
export const useFavoriteAction = () => {
  const { user } = useAuth();
  const {
    toggleFavorite,
    isPending: isFavoritePending,
    pendingMoverId: favoritePendingMoverId,
    isMoverPending,
  } = useToggleFavorite();
  const [authModalKind, setAuthModalKind] = useState<AuthModalKind | null>(
    null
  );

  const handleFavoriteClick = (moverId: string, nextFavorited: boolean) => {
    if (!user) {
      setAuthModalKind('login');
      return;
    }

    if (!user.isProfileCompleted) {
      setAuthModalKind('profile');
      return;
    }

    toggleFavorite(moverId, nextFavorited);
  };

  const openLoginModal = () => {
    setAuthModalKind('login');
  };

  const openProfileModal = () => {
    setAuthModalKind('profile');
  };

  const closeAuthModal = () => {
    setAuthModalKind(null);
  };

  return {
    user,
    handleFavoriteClick,
    isFavoritePending,
    favoritePendingMoverId,
    isMoverPending,
    openLoginModal,
    openProfileModal,
    closeAuthModal,
    isLoginModalOpen: authModalKind === 'login',
    isProfileModalOpen: authModalKind === 'profile',
  };
};
