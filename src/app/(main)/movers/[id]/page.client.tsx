'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { ProfileRequiredModal } from '@/components/auth/ProfileRequiredModal';
import { MoverCard } from '@/components/movers/MoverCard';
import { MoverReviews } from '@/components/movers/MoverReviews';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useMoverDetail } from '@/hooks/useMoverDetail';
import { resolveApiErrorMessage } from '@/lib/apiClient';
import {
  fadeIn,
  fadeUp,
  getMotionTransition,
  listStagger,
} from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

import { MOVERS_PAGE_X_PADDING } from '../_components/moversLayout';
import { AlreadyDesignatedModal } from './_components/AlreadyDesignatedModal';
import { MoverDetailBottomBar } from './_components/MoverDetailBottomBar';
import { MoverDetailSections } from './_components/MoverDetailSections';
import { MoverDetailShareSection } from './_components/MoverDetailShareSection';
import { MoverDetailSidebar } from './_components/MoverDetailSidebar';
import { NeedGeneralEstimateModal } from './_components/NeedGeneralEstimateModal';
import { useMoverDetailActions } from './_lib/useMoverDetailActions';

export interface MoverDetailPageClientProps {
  moverId: string;
}

/** `/movers/[id]` 클라이언트. - 상세 Query, 찜·지정·채팅 오케스트레이션. */
const MoverDetailPageClient = ({ moverId }: MoverDetailPageClientProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

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

  const errorMessage = resolveApiErrorMessage(
    error,
    '기사님 정보를 불러오지 못했습니다.'
  );

  const handleRetry = () => {
    void refetch();
  };

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
          MOVERS_PAGE_X_PADDING
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

export default MoverDetailPageClient;
