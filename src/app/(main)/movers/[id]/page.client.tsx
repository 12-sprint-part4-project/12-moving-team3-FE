'use client';

import { motion } from 'framer-motion';

import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { ProfileRequiredModal } from '@/components/auth/ProfileRequiredModal';
import { MoverCard } from '@/components/movers/MoverCard';
import { useMoverDetail } from '@/hooks/useMoverDetail';
import { resolveApiErrorMessage } from '@/lib/apiClient';
import { fadeUp, listStagger } from '@/lib/motionVariants';
import { isMoverId } from '@/types/mover';

import { MOVERS_DETAIL_CONTENT_CLASS } from '../_components/moversLayout';
import { AlreadyDesignatedModal } from './_components/AlreadyDesignatedModal';
import { MoverDetailBottomBar } from './_components/MoverDetailBottomBar';
import { MoverDetailSections } from './_components/MoverDetailSections';
import { MoverDetailShareSection } from './_components/MoverDetailShareSection';
import { MoverDetailSidebar } from './_components/MoverDetailSidebar';
import { MoverDetailStatus } from './_components/MoverDetailStatus';
import { MoverReviewsPanel } from './_components/MoverReviewsPanel';
import { NeedGeneralEstimateModal } from './_components/NeedGeneralEstimateModal';
import { useMoverDetailActions } from './_lib/useMoverDetailActions';

import type {
  MoverDetailFavorite,
  MoverDetailShare,
} from './_lib/moverDetailActions';

export interface MoverDetailPageClientProps {
  moverId: string;
}

/** `/movers/[id]` 클라이언트. - 상세 Query·찜·지정·채팅 오케스트레이션. */
const MoverDetailPageClient = ({ moverId }: MoverDetailPageClientProps) => {
  const { mover, isPending, isError, error, isNotFound, refetch } =
    useMoverDetail(moverId);
  const {
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
  } = useMoverDetailActions(moverId);

  const isValidMoverId = isMoverId(moverId);
  const errorMessage = resolveApiErrorMessage(
    error,
    '기사님 정보를 불러오지 못했습니다.'
  );

  const handleRetry = () => {
    void refetch();
  };

  if (!isValidMoverId) {
    return <MoverDetailStatus variant="invalid" />;
  }

  if (isPending) {
    return <MoverDetailStatus variant="pending" />;
  }

  if (isNotFound) {
    return <MoverDetailStatus variant="notFound" />;
  }

  if (isError || !mover) {
    return (
      <MoverDetailStatus
        variant="error"
        message={errorMessage}
        onRetry={handleRetry}
      />
    );
  }

  const handleSidebarFavoriteClick = () => {
    handleFavoriteClick(mover.moverId, !mover.isFavorited);
  };

  const favorite: MoverDetailFavorite = {
    isFavorited: mover.isFavorited,
    isFavoritePending: isMoverPending(mover.moverId),
    onFavoriteClick: handleSidebarFavoriteClick,
  };

  const share: MoverDetailShare = {
    name: mover.name,
    description: mover.shortDescription,
    profileImageUrl: mover.profileImageUrl,
  };

  return (
    <>
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

            <motion.div variants={fadeUp} className="py-6 xl:py-10">
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
      </div>

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
    </>
  );
};

export default MoverDetailPageClient;
