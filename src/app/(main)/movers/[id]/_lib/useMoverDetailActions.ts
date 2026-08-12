import { useCallback, useMemo } from 'react';

import { useDesignatedEstimateRequest } from '@/hooks/useDesignatedEstimateRequest';
import { useFavoriteAction } from '@/hooks/useFavoriteAction';
import { useStartEstimateChat } from '@/hooks/useStartEstimateChat';
import type { MoverCardModel } from '@/types/mover';

import type {
  MoverDetailChat,
  MoverDetailDesignated,
  MoverDetailFavorite,
  MoverDetailShare,
} from './moverDetailActions';

/**
 * 기사 상세 — 찜·지정 견적·채팅 액션과 묶음 props.
 */
export const useMoverDetailActions = (
  moverId: string,
  mover: MoverCardModel | null
) => {
  const {
    user,
    handleFavoriteClick,
    isMoverPending,
    isLoginModalOpen,
    isProfileModalOpen,
    openLoginModal,
    openProfileModal,
    closeAuthModal,
  } = useFavoriteAction();

  const {
    isPending: isDesignatedPending,
    isAlreadyDesignated,
    designatedMoverId,
    estimateRequestId,
    hasReceivedQuoteFromMover,
    isQuoteStatusError,
    isStatusLoading: isDesignatedStatusLoading,
    isDesignatedRequestFailed,
    needGeneralOpen,
    alreadyDesignatedOpen,
    closeNeedGeneralModal,
    closeAlreadyDesignatedModal,
    requestDesignatedEstimate,
  } = useDesignatedEstimateRequest(moverId);

  const { startEstimateChat, isChatPending } = useStartEstimateChat();

  const showDesignatedCta = user?.userType !== 'MOVER';
  const showChatCta =
    showDesignatedCta &&
    isAlreadyDesignated &&
    designatedMoverId != null &&
    estimateRequestId != null;

  const handleDesignatedQuoteClick = useCallback(() => {
    if (!user) {
      openLoginModal();
      return;
    }

    if (!user.isProfileCompleted) {
      openProfileModal();
      return;
    }

    requestDesignatedEstimate();
  }, [user, openLoginModal, openProfileModal, requestDesignatedEstimate]);

  const handleChatClick = useCallback(() => {
    if (!user) {
      openLoginModal();
      return;
    }

    if (!user.isProfileCompleted) {
      openProfileModal();
      return;
    }

    if (designatedMoverId == null || estimateRequestId == null) {
      return;
    }

    startEstimateChat({
      moverId,
      isDesignated: true,
      estimateRequestId,
      designatedMoverId,
    });
  }, [
    user,
    openLoginModal,
    openProfileModal,
    designatedMoverId,
    estimateRequestId,
    startEstimateChat,
    moverId,
  ]);

  const handleSidebarFavoriteClick = useCallback(() => {
    if (!mover) {
      return;
    }
    handleFavoriteClick(mover.moverId, !mover.isFavorited);
  }, [mover, handleFavoriteClick]);

  const favorite = useMemo((): MoverDetailFavorite => {
    if (!mover) {
      return {
        isFavorited: false,
        isFavoritePending: false,
        onFavoriteClick: handleSidebarFavoriteClick,
      };
    }

    return {
      isFavorited: mover.isFavorited,
      isFavoritePending: isMoverPending(mover.moverId),
      onFavoriteClick: handleSidebarFavoriteClick,
    };
  }, [mover, isMoverPending, handleSidebarFavoriteClick]);

  const designated = useMemo(
    (): MoverDetailDesignated => ({
      showCta: showDesignatedCta,
      isPending: isDesignatedPending,
      isAlreadyDesignated,
      hasReceivedQuoteFromMover,
      isQuoteStatusError,
      isStatusLoading: isDesignatedStatusLoading,
      isRequestFailed: isDesignatedRequestFailed,
      onClick: handleDesignatedQuoteClick,
    }),
    [
      showDesignatedCta,
      isDesignatedPending,
      isAlreadyDesignated,
      hasReceivedQuoteFromMover,
      isQuoteStatusError,
      isDesignatedStatusLoading,
      isDesignatedRequestFailed,
      handleDesignatedQuoteClick,
    ]
  );

  const chat = useMemo(
    (): MoverDetailChat => ({
      showCta: showChatCta,
      isPending: isChatPending,
      onClick: handleChatClick,
    }),
    [showChatCta, isChatPending, handleChatClick]
  );

  const share = useMemo((): MoverDetailShare | null => {
    if (!mover) {
      return null;
    }

    return {
      name: mover.name,
      description: mover.shortDescription,
      profileImageUrl: mover.profileImageUrl,
    };
  }, [mover]);

  return {
    handleFavoriteClick,
    isMoverPending,
    favorite,
    designated,
    chat,
    share,
    isLoginModalOpen,
    isProfileModalOpen,
    closeAuthModal,
    needGeneralOpen,
    alreadyDesignatedOpen,
    closeNeedGeneralModal,
    closeAlreadyDesignatedModal,
  };
};
