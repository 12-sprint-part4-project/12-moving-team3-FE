'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

import { MoverCard } from '@/components/movers/MoverCard';
import { MoverReviews } from '@/components/movers/MoverReviews';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useDesignatedEstimateRequest } from '@/hooks/useDesignatedEstimateRequest';
import { useMoverDetail } from '@/hooks/useMoverDetail';
import { useToggleFavorite } from '@/hooks/useToggleFavorite';
import { ApiError } from '@/lib/apiClient';
import { cn } from '@/lib/utils';

import { LoginRequiredModal } from '../_components/LoginRequiredModal';
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

  const { user } = useAuth();
  const { toggleFavorite, isPending: isFavoritePending } = useToggleFavorite();
  const {
    isPending: isDesignatedPending,
    needGeneralOpen,
    alreadyDesignatedOpen,
    closeNeedGeneralModal,
    closeAlreadyDesignatedModal,
    requestDesignatedEstimate,
  } = useDesignatedEstimateRequest();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { mover, isPending, isError, error, isNotFound, refetch } =
    useMoverDetail(moverId);

  const handleFavoriteClick = (
    targetMoverId: string,
    nextFavorited: boolean
  ) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    toggleFavorite(targetMoverId, nextFavorited);
  };

  const handleDesignatedQuoteClick = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    void requestDesignatedEstimate(moverId);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
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
            isFavoritePending={isFavoritePending}
          />

          <div className="mt-6 border-t border-line-100 xl:mt-10" />

          <MoverDetailShareSection
            nickname={mover.nickname}
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
          nickname={mover.nickname}
          description={mover.shortDescription}
          profileImageUrl={mover.profileImageUrl}
          isFavorited={mover.isFavorited}
          isFavoritePending={isFavoritePending}
          onFavoriteClick={() =>
            handleFavoriteClick(mover.moverId, !mover.isFavorited)
          }
          onDesignatedQuoteClick={handleDesignatedQuoteClick}
          isDesignatedPending={isDesignatedPending}
        />
      </div>

      <MoverDetailBottomBar
        isFavorited={mover.isFavorited}
        isFavoritePending={isFavoritePending}
        onFavoriteClick={() =>
          handleFavoriteClick(mover.moverId, !mover.isFavorited)
        }
        onDesignatedQuoteClick={handleDesignatedQuoteClick}
        isDesignatedPending={isDesignatedPending}
      />

      <LoginRequiredModal
        open={isLoginModalOpen}
        onClose={handleCloseLoginModal}
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
