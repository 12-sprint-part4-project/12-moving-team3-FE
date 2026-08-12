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

  //찜을 클릭 했을 때, 해야 할 일의 종류를 설정함.
  const handleFavoriteClick = (moverId: string, nextFavorited: boolean) => {
    if (!user) {
      //로그인 안 된 상태면, 로그인 모달로 설정
      setAuthModalKind('login');
      return;
    }

    if (!user.isProfileCompleted) {
      //프로필 안 완성된 상태면, 프로필 모달로 설정
      setAuthModalKind('profile');
      return;
    }

    toggleFavorite(moverId, nextFavorited);
  };

  //(상위 컴포넌트에서 로그인 모달을 여는 로직을 다르게 수행하고 싶을 때 사용하면 됨. movers에선 사용되지 않음.)
  //로그인 모달 열기
  const openLoginModal = () => {
    setAuthModalKind('login');
  };

  //프로필 모달 열기
  const openProfileModal = () => {
    setAuthModalKind('profile');
  };

  //모달 닫기 (로그인, 프로필 모달 모두) 이건 movers에서 사용됨.
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
    isLoginModalOpen: authModalKind === 'login', //이게 true라면, 상위 컴포넌트에서 로그인 모달을 열어주는 것임.
    isProfileModalOpen: authModalKind === 'profile', //이게 true라면, 상위 컴포넌트에서 프로필 모달을 열어주는 것임.
  };
};
