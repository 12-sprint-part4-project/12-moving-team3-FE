'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useConfirmQuoteModal } from '@/hooks/useConfirmQuoteModal';
import { useFavoriteAction } from '@/hooks/useFavoriteAction';
import { getMotionTransition, tabContentSlide } from '@/lib/motionVariants';

import { ConfirmQuoteModal } from './_components/ConfirmQuoteModal';
import { parseCustomerQuotesTabId } from './_components/CustomerQuotesTabs';
import { PendingQuotesPanel } from './_components/PendingQuotesPanel';
import { ReceivedQuotesPanel } from './_components/ReceivedQuotesPanel';

const TAB_PANEL_CLASS = 'flex min-h-0 flex-1 flex-col';

/** 고객 내 견적 관리 본문 — 대기 중 / 받았던 견적 탭 */
const CustomerQuotesPageClient = () => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = parseCustomerQuotesTabId(searchParams.get('tab'));
  const { user, isReady } = useAuth();
  const isCustomerReady = isReady && user?.userType === 'CUSTOMER';
  const isActiveTabPending = activeTab === 'pending';
  const tabDirection = activeTab === 'received' ? 1 : -1;
  const { handleFavoriteClick, isMoverPending } = useFavoriteAction();

  /** 견적 확정 후 이용 내역으로 이동 */
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
              <PendingQuotesPanel
                enabled={isCustomerReady}
                isConfirming={isConfirming}
                confirmingQuoteId={confirmingQuoteId}
                onConfirm={openConfirmModal}
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
              <ReceivedQuotesPanel
                enabled={isCustomerReady}
                onFavoriteClick={handleFavoriteClick}
                isMoverPending={isMoverPending}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
