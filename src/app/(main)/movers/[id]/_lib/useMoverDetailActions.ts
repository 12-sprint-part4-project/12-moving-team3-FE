import { useCallback, useMemo } from 'react';

import { useDesignatedEstimateRequest } from '@/hooks/useDesignatedEstimateRequest';
import { useFavoriteAction } from '@/hooks/useFavoriteAction';
import { useStartEstimateChat } from '@/hooks/useStartEstimateChat';

import {
  resolveShowChatCta,
  resolveShowDesignatedCta,
} from './moverDetail.utils';

import type { MoverDetailChat, MoverDetailDesignated } from './moverDetailActions';

/**
 * 기사 상세 — 지정 견적·채팅 액션과 인증 모달.
 * 찜·공유는 가드로 mover를 좁힌 뒤 페이지에서 만든다.
 */
export const useMoverDetailActions = (moverId: string) => {
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

  const showDesignatedCta = resolveShowDesignatedCta(user?.userType);
  const showChatCta = resolveShowChatCta({
    showDesignatedCta,
    isAlreadyDesignated,
    designatedMoverId,
    estimateRequestId,
  });

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

  return {
    handleFavoriteClick,
    isMoverPending,
    designated,
    chat,
    isLoginModalOpen,
    isProfileModalOpen,
    closeAuthModal,
    needGeneralOpen,
    alreadyDesignatedOpen,
    closeNeedGeneralModal,
    closeAlreadyDesignatedModal,
  };
};
