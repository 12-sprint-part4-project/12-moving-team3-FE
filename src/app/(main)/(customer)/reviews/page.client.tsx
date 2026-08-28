'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';
import {
  getMotionTransition,
  getTabPanelMotionProps,
} from '@/lib/motionVariants';

import { REVIEWS_TAB_PANEL_CLASS } from './_components/reviewsStyles';
import { WritableReviewsPanel } from './_components/WritableReviewsPanel';
import { WrittenReviewsPanel } from './_components/WrittenReviewsPanel';

import type { ReviewsPageTab } from './_components/ReviewsTabs';

export interface ReviewsPageClientProps {
  activeTab: ReviewsPageTab;
  highlightReviewId: number | null;
}

/** `/reviews` 클라이언트. - 탭 패널 전환·작성 성공 후 URL 정책. */
const ReviewsPageClient = ({
  activeTab,
  highlightReviewId,
}: ReviewsPageClientProps) => {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const { user, isReady } = useAuth();

  const isCustomerReady = isReady && user?.userType === 'CUSTOMER';
  const isActiveTabWritable = activeTab === 'writable';
  const tabDirection = activeTab === 'written' ? 1 : -1;
  const tabPanelMotion = getTabPanelMotionProps(
    tabDirection,
    getMotionTransition(shouldReduceMotion)
  );

  const handleReviewCreated = (reviewId: number) => {
    router.replace(`/reviews?tab=written&highlight=${reviewId}`);
  };

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden bg-background-200">
      <AnimatePresence mode="wait" custom={tabDirection}>
        {isActiveTabWritable ? (
          <motion.div
            key="writable"
            {...tabPanelMotion}
            role="tabpanel"
            id="reviews-panel-writable"
            aria-labelledby="reviews-tab-writable"
            className={REVIEWS_TAB_PANEL_CLASS}
          >
            <WritableReviewsPanel
              enabled={isCustomerReady}
              onReviewCreated={handleReviewCreated}
            />
          </motion.div>
        ) : (
          <motion.div
            key="written"
            {...tabPanelMotion}
            role="tabpanel"
            id="reviews-panel-written"
            aria-labelledby="reviews-tab-written"
            className={REVIEWS_TAB_PANEL_CLASS}
          >
            <WrittenReviewsPanel
              enabled={isCustomerReady}
              highlightReviewId={highlightReviewId}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewsPageClient;
