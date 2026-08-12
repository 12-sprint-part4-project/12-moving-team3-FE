'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useParams } from 'next/navigation';

import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { ProfileRequiredModal } from '@/components/auth/ProfileRequiredModal';
import { MoverCard } from '@/components/movers/MoverCard';
import { MoverReviews } from '@/components/movers/MoverReviews';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useMoverDetail } from '@/hooks/useMoverDetail';
import { ApiError } from '@/lib/apiClient';
import {
  fadeIn,
  fadeUp,
  getMotionTransition,
  listStagger,
} from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

import { AlreadyDesignatedModal } from './_components/AlreadyDesignatedModal';
import { MoverDetailBottomBar } from './_components/MoverDetailBottomBar';
import { MoverDetailSections } from './_components/MoverDetailSections';
import { MoverDetailShareSection } from './_components/MoverDetailShareSection';
import { MoverDetailSidebar } from './_components/MoverDetailSidebar';
import { NeedGeneralEstimateModal } from './_components/NeedGeneralEstimateModal';
import { useMoverDetailActions } from './_lib/useMoverDetailActions';

/** 기사님 상세 페이지 클라이언트 */
export const MoverDetailPageClient = () => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const params = useParams();
  const moverId = typeof params.id === 'string' ? params.id : '';

  const { mover, isPending, isError, error, isNotFound, refetch } =
    useMoverDetail(moverId);

  const {
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
  } = useMoverDetailActions(moverId, mover ?? null);

  const handleRetry = () => {
    void refetch();
  };

  const pageXPadding =
    'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

  if (isNotFound) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        transition={motionTransition}
        className="flex w-full flex-col items-center justify-center py-24"
      >
        <p className="text-lg-medium text-gray-400">기사님을 찾을 수 없어요.</p>
      </motion.div>
    );
  }

  if (isPending) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        transition={motionTransition}
        className="flex w-full flex-col py-24"
      >
        <Spinner message="기사님 정보를 불러오는 중..." />
      </motion.div>
    );
  }

  if (isError || !mover || !share) {
    const errorMessage =
      error instanceof ApiError
        ? error.message
        : (error?.message ?? '기사님 정보를 불러오지 못했습니다.');

    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        transition={motionTransition}
        className="flex w-full flex-col items-center gap-4 py-24"
      >
        <p className="text-lg-medium text-gray-400">{errorMessage}</p>
        <button
          type="button"
          onClick={handleRetry}
          className="cursor-pointer rounded-lg bg-blue-300 px-4 py-2 text-lg-semibold text-white"
        >
          다시 시도
        </button>
      </motion.div>
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
        <motion.div
          variants={listStagger}
          initial="hidden"
          animate="show"
          className="flex min-w-0 flex-1 flex-col"
        >
          <motion.div variants={fadeUp}>
            <MoverCard
              mover={mover}
              size="lg"
              disableNavigation
              onFavoriteClick={handleFavoriteClick}
              isFavoritePending={isMoverPending(mover.moverId)}
            />
          </motion.div>

          <div className="mt-6 border-t border-line-100 xl:mt-10" />

          <motion.div variants={fadeUp}>
            <MoverDetailShareSection
              name={share.name}
              description={share.description}
              profileImageUrl={share.profileImageUrl}
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <MoverDetailSections mover={mover} />
          </motion.div>

          <motion.div variants={fadeUp} className="py-6 lg:py-10">
            <MoverReviews moverId={mover.moverId} />
          </motion.div>
        </motion.div>

        <MoverDetailSidebar
          className="hidden xl:flex"
          favorite={favorite}
          designated={designated}
          chat={chat}
          share={share}
        />
      </div>

      <MoverDetailBottomBar
        favorite={favorite}
        designated={designated}
        chat={chat}
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
