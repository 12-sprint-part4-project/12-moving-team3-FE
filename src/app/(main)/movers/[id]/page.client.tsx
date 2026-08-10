'use client';

import { useParams } from 'next/navigation';

import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { ProfileRequiredModal } from '@/components/auth/ProfileRequiredModal';
import { MoverCard } from '@/components/movers/MoverCard';
import { MoverReviews } from '@/components/movers/MoverReviews';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useDesignatedEstimateRequest } from '@/hooks/useDesignatedEstimateRequest';
import { useFavoriteAction } from '@/hooks/useFavoriteAction';
import { useMoverDetail } from '@/hooks/useMoverDetail';
import { useStartEstimateChat } from '@/hooks/useStartEstimateChat';
import { ApiError } from '@/lib/apiClient';
import { cn } from '@/lib/utils';

import { AlreadyDesignatedModal } from './_components/AlreadyDesignatedModal';
import { MoverDetailBottomBar } from './_components/MoverDetailBottomBar';
import { MoverDetailSections } from './_components/MoverDetailSections';
import { MoverDetailShareSection } from './_components/MoverDetailShareSection';
import { MoverDetailSidebar } from './_components/MoverDetailSidebar';
import { NeedGeneralEstimateModal } from './_components/NeedGeneralEstimateModal';

/** 기사님 상세 페이지 클라이언트 */
export const MoverDetailPageClient = () => {
  const params = useParams();
  const moverId = typeof params.id === 'string' ? params.id : '';

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
    needGeneralOpen,
    alreadyDesignatedOpen,
    closeNeedGeneralModal,
    closeAlreadyDesignatedModal,
    requestDesignatedEstimate,
  } = useDesignatedEstimateRequest(moverId);

  const { startEstimateChat, isChatPending } = useStartEstimateChat();

  const { mover, isPending, isError, error, isNotFound, refetch } =
    useMoverDetail(moverId);

  /** 기사 계정은 지정 견적 CTA 숨김. 게스트·고객은 표시 */
  const showDesignatedCta = user?.userType !== 'MOVER';
  /**
   * `/movers/[id]` — SUBMITTED 후 지정만 한 기사와 DESIGNATED 채팅.
   * 지정 완료 + designatedMoverId 있을 때만 CTA 노출 (지정 전 숨김).
   */
  const showChatCta =
    showDesignatedCta &&
    isAlreadyDesignated &&
    designatedMoverId != null &&
    estimateRequestId != null;

  const handleDesignatedQuoteClick = () => {
    if (!user) {
      openLoginModal();
      return;
    }

    if (!user.isProfileCompleted) {
      openProfileModal();
      return;
    }

    requestDesignatedEstimate();
  };

  /** 지정 행 id로 DESIGNATED 방 생성·재진입 후 `/chat/{roomId}` */
  const handleChatClick = () => {
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
  };

  const handleRetry = () => {
    void refetch();
  };

  const pageXPadding =
    'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

  if (isNotFound) {
    return (
      <div className="flex w-full flex-col items-center justify-center py-24">
        <p className="text-lg-medium text-gray-400">기사님을 찾을 수 없어요.</p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex w-full flex-col py-24">
        <Spinner message="기사님 정보를 불러오는 중..." />
      </div>
    );
  }

  if (isError || !mover) {
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : (error?.message ?? '기사님 정보를 불러오지 못했습니다.');

    return (
      <div className="flex w-full flex-col items-center gap-4 py-24">
        <p className="text-lg-medium text-gray-400">{errorMessage}</p>
        <button
          type="button"
          onClick={handleRetry}
          className="cursor-pointer rounded-lg bg-blue-300 px-4 py-2 text-lg-semibold text-white"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-white pb-24 xl:pb-0">
      <div
        className={cn(
          'mx-auto flex w-full max-w-[1920px] flex-col gap-0 py-6 md:py-8 xl:flex-row xl:items-start xl:gap-[7.6875rem] xl:py-9',
          pageXPadding
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <MoverCard
            mover={mover}
            size="lg"
            disableNavigation
            onFavoriteClick={handleFavoriteClick}
            isFavoritePending={isMoverPending(mover.moverId)}
          />

          <div className="mt-6 border-t border-line-100 xl:mt-10" />

          <MoverDetailShareSection
            name={mover.name}
            description={mover.shortDescription}
            profileImageUrl={mover.profileImageUrl}
          />

          <MoverDetailSections mover={mover} />

          <div className="py-6 lg:py-10">
            <MoverReviews moverId={mover.moverId} />
          </div>
        </div>

        <MoverDetailSidebar
          className="hidden xl:flex"
          name={mover.name}
          description={mover.shortDescription}
          profileImageUrl={mover.profileImageUrl}
          isFavorited={mover.isFavorited}
          isFavoritePending={isMoverPending(mover.moverId)}
          onFavoriteClick={() =>
            handleFavoriteClick(mover.moverId, !mover.isFavorited)
          }
          showDesignatedCta={showDesignatedCta}
          onDesignatedQuoteClick={handleDesignatedQuoteClick}
          isDesignatedPending={isDesignatedPending}
          isAlreadyDesignated={isAlreadyDesignated}
          hasReceivedQuoteFromMover={hasReceivedQuoteFromMover}
          isQuoteStatusError={isQuoteStatusError}
          isDesignatedStatusLoading={isDesignatedStatusLoading}
          showChatCta={showChatCta}
          onChatClick={handleChatClick}
          isChatPending={isChatPending}
        />
      </div>

      <MoverDetailBottomBar
        isFavorited={mover.isFavorited}
        isFavoritePending={isMoverPending(mover.moverId)}
        onFavoriteClick={() =>
          handleFavoriteClick(mover.moverId, !mover.isFavorited)
        }
        showDesignatedCta={showDesignatedCta}
        onDesignatedQuoteClick={handleDesignatedQuoteClick}
        isDesignatedPending={isDesignatedPending}
        isAlreadyDesignated={isAlreadyDesignated}
        hasReceivedQuoteFromMover={hasReceivedQuoteFromMover}
        isQuoteStatusError={isQuoteStatusError}
        isDesignatedStatusLoading={isDesignatedStatusLoading}
        showChatCta={showChatCta}
        onChatClick={handleChatClick}
        isChatPending={isChatPending}
      />

      <LoginRequiredModal open={isLoginModalOpen} onClose={closeAuthModal} />
      <ProfileRequiredModal
        open={isProfileModalOpen}
        onClose={closeAuthModal}
      />
      <NeedGeneralEstimateModal
        open={needGeneralOpen}
        onClose={closeNeedGeneralModal}
      />
      <AlreadyDesignatedModal
        open={alreadyDesignatedOpen}
        onClose={closeAlreadyDesignatedModal}
      />
    </div>
  );
};
