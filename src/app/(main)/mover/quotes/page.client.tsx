'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import {
  getMotionTransition,
  getTabPanelMotionProps,
} from '@/lib/motionVariants';

import { MoverQuotesListPanel } from './_components/MoverQuotesListPanel';
import { MOVER_QUOTES_TAB_PANEL_CLASS } from './_components/moverQuotesStyles';

import type { MoverQuotesTabId } from './_components/MoverQuotesTabs';

export interface MoverQuotesPageClientProps {
  activeTab: MoverQuotesTabId;
}

/** `/mover/quotes` 클라이언트. - 기사 내 견적 관리 본문 */
const MoverQuotesPageClient = ({ activeTab }: MoverQuotesPageClientProps) => {
  const shouldReduceMotion = useReducedMotion();

  const isActiveTabSent = activeTab === 'sent';
  /** 탭 슬라이드 방향 (rejected 진입 +1, sent 복귀 -1) */
  const tabDirection = activeTab === 'rejected' ? 1 : -1;
  const tabPanelMotion = getTabPanelMotionProps(
    tabDirection,
    getMotionTransition(shouldReduceMotion)
  );

  // 활성 탭 패널
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden bg-background-200">
      <AnimatePresence mode="wait" custom={tabDirection}>
        {isActiveTabSent ? (
          <motion.div
            key="sent"
            {...tabPanelMotion}
            role="tabpanel"
            id="quotes-panel-sent"
            aria-labelledby="quotes-tab-sent"
            className={MOVER_QUOTES_TAB_PANEL_CLASS}
          >
            {/* 보낸 견적 목록 */}
            <MoverQuotesListPanel status="SENT" />
          </motion.div>
        ) : (
          <motion.div
            key="rejected"
            {...tabPanelMotion}
            role="tabpanel"
            id="quotes-panel-rejected"
            aria-labelledby="quotes-tab-rejected"
            className={MOVER_QUOTES_TAB_PANEL_CLASS}
          >
            {/* 반려 요청 목록 */}
            <MoverQuotesListPanel status="REJECTED" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoverQuotesPageClient;
