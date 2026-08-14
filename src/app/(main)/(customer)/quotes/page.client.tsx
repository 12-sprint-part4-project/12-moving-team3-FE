'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useConfirmQuoteModal } from '@/hooks/useConfirmQuoteModal';
import { useFavoriteAction } from '@/hooks/useFavoriteAction';
import { useStartEstimateChat } from '@/hooks/useStartEstimateChat';
import { getMotionTransition, tabContentSlide } from '@/lib/motionVariants';
import { toStartEstimateChatParams } from '@/lib/startEstimateChat';
import type { PendingQuoteCardModel } from '@/types/customerQuote';

import { ConfirmQuoteModal } from './_components/ConfirmQuoteModal';
import type { CustomerQuotesTabId } from './_components/CustomerQuotesTabs';
import { PendingQuotesPanel } from './_components/PendingQuotesPanel';
import { ReceivedQuotesPanel } from './_components/ReceivedQuotesPanel';

/** 탭 패널 공통 레이아웃 */
const TAB_PANEL_CLASS = 'flex min-h-0 flex-1 flex-col';

export interface CustomerQuotesPageClientProps {
  activeTab: CustomerQuotesTabId;
}

/** `/quotes` 클라이언트. - 고객 내 견적 관리 본문 */
const CustomerQuotesPageClient = ({
  activeTab,
}: CustomerQuotesPageClientProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const router = useRouter();
  const { user, isReady } = useAuth();
  const isCustomerReady = isReady && user?.userType === 'CUSTOMER';
  const isActiveTabPending = activeTab === 'pending';
  /** 탭 슬라이드 방향 (received 진입 +1, pending 복귀 -1) */
  const tabDirection = activeTab === 'received' ? 1 : -1;
  const { handleFavoriteClick, isMoverPending } = useFavoriteAction();
  const { startEstimateChat, pendingChatTargetId } = useStartEstimateChat();

  /** 견적 확정 성공 후 이용 내역으로 이동 */
  const goToHistory = useCallback(() => {
    router.replace('/quotes/history');
  }, [router]);

  const {
    isConfirmModalOpen,
    isConfirming,
    confirmingQuoteId,
    openConfirmModal,
    closeConfirmModal,
    submitConfirm,
  } = useConfirmQuoteModal(goToHistory);

  /** 대기 카드 채팅하기 — 방 생성 후 `/chat/{roomId}` 이동 */
  const handleChatClick = (quote: PendingQuoteCardModel) => {
    startEstimateChat(
      toStartEstimateChatParams(quote, quote.mover.moverId),
      quote.quoteId
    );
  };

  // 활성 탭 패널 + 견적 확정 모달
  return (
    <>
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden bg-background-200">
        <AnimatePresence mode="wait" custom={tabDirection}>
          {isActiveTabPending ? (
            <motion.div
              key="pending"
              custom={tabDirection}
              variants={tabContentSlide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={motionTransition}
              role="tabpanel"
              id="quotes-panel-pending"
              aria-labelledby="quotes-tab-pending"
              className={TAB_PANEL_CLASS}
            >
              {/* 대기 중인 견적 목록 */}
              <PendingQuotesPanel
                enabled={isCustomerReady}
                isConfirming={isConfirming}
                confirmingQuoteId={confirmingQuoteId}
                pendingChatQuoteId={pendingChatTargetId}
                onConfirm={openConfirmModal}
                onChatClick={handleChatClick}
                onFavoriteClick={handleFavoriteClick}
                isMoverPending={isMoverPending}
              />
            </motion.div>
          ) : (
            <motion.div
              key="received"
              custom={tabDirection}
              variants={tabContentSlide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={motionTransition}
              role="tabpanel"
              id="quotes-panel-received"
              aria-labelledby="quotes-tab-received"
              className={TAB_PANEL_CLASS}
            >
              {/* 받았던 견적 그룹 목록 */}
              <ReceivedQuotesPanel
                enabled={isCustomerReady}
                onFavoriteClick={handleFavoriteClick}
                isMoverPending={isMoverPending}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 견적 확정 재확인 모달 */}
      <ConfirmQuoteModal
        open={isConfirmModalOpen}
        isConfirming={isConfirming}
        onClose={closeConfirmModal}
        onConfirm={submitConfirm}
      />
    </>
  );
};

export default CustomerQuotesPageClient;
