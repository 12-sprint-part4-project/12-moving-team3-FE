'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { ProfileRequiredModal } from '@/components/auth/ProfileRequiredModal';
import { Button } from '@/components/Button/Button';
import { MoverCard } from '@/components/movers/MoverCard';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useMoverDetail } from '@/hooks/useMoverDetail';
import { resolveApiErrorMessage } from '@/lib/apiClient';
import {
  fadeIn,
  fadeUp,
  getMotionTransition,
  listStagger,
} from '@/lib/motionVariants';

import { AlreadyDesignatedModal } from './AlreadyDesignatedModal';
import { MoverDetailBottomBar } from './MoverDetailBottomBar';
import { MoverDetailSections } from './MoverDetailSections';
import { MoverDetailShareSection } from './MoverDetailShareSection';
import { MoverDetailSidebar } from './MoverDetailSidebar';
import { MoverReviewsPanel } from './MoverReviewsPanel';
import { NeedGeneralEstimateModal } from './NeedGeneralEstimateModal';
import { MOVERS_DETAIL_CONTENT_CLASS } from '../../_components/moversLayout';
import { useMoverDetailActions } from '../_lib/useMoverDetailActions';

export interface MoverDetailContentPanelProps {
  moverId: string;
}

/** `/movers/[id]` 상세 본문 패널. Query·찜·지정·채팅 오케스트레이션. */
export const MoverDetailContentPanel = ({
  moverId,
}: MoverDetailContentPanelProps) => {
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
        <Button
          type="button"
          variant="solid"
          size="sm"
          onClick={handleRetry}
          className="w-auto"
        >
          다시 시도
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-white pb-24 xl:pb-0">
      <div className={MOVERS_DETAIL_CONTENT_CLASS}>
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
            <MoverReviewsPanel moverId={mover.moverId} />
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
