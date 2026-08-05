'use client';

import { useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useToggleFavorite } from '@/hooks/useToggleFavorite';

/**
 * 로그인 가드가 포함된 찜 토글.
 * 비회원이면 로그인 모달을 열고, 회원이면 useToggleFavorite를 호출한다.
 * 지정 견적 등 동일 모달이 필요하면 openLoginModal을 사용한다.
 */
export const useFavoriteAction = () => {
  const { user } = useAuth();
  const {
    toggleFavorite,
    isPending: isFavoritePending,
    pendingMoverId: favoritePendingMoverId,
    isMoverPending,
  } = useToggleFavorite();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleFavoriteClick = (moverId: string, nextFavorited: boolean) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    toggleFavorite(moverId, nextFavorited);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return {
    user,
    handleFavoriteClick,
    isFavoritePending,
    favoritePendingMoverId,
    isMoverPending,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
  };
};
