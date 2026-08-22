'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { ReviewsEmptyState } from '@/components/reviews/ReviewsEmptyState';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useTranslation } from '@/i18n/useTranslation';
import { fadeIn, getMotionTransition } from '@/lib/motionVariants';

import { REVIEWS_CONTENT_CLASS } from './reviewsStyles';

import type { ReactNode } from 'react';

interface ReviewsContentProps {
  children: ReactNode;
}

/** `/reviews` 탭 본문 패딩 셸. 로딩·에러·empty·목록 공통. */
export const ReviewsContent = ({ children }: ReviewsContentProps) => (
  <div className={REVIEWS_CONTENT_CLASS}>{children}</div>
);

interface ReviewsPendingStatusProps {
  variant: 'pending';
  message: string;
}

interface ReviewsErrorStatusProps {
  variant: 'error';
  message: string;
  onRetry: () => void;
}

interface ReviewsEmptyStatusProps {
  variant: 'empty';
  message?: string;
}

export type ReviewsListStatusProps =
  | ReviewsPendingStatusProps
  | ReviewsErrorStatusProps
  | ReviewsEmptyStatusProps;

/**
 * `/reviews` 목록 패널 공통 상태 UI.
 * 가드(언제 보여줄지)는 패널 early return이 담당한다.
 */
export const ReviewsListStatus = (props: ReviewsListStatusProps) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

  if (props.variant === 'pending') {
    return (
      <ReviewsContent>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={motionTransition}
        >
          <Spinner message={props.message} />
        </motion.div>
      </ReviewsContent>
    );
  }

  if (props.variant === 'error') {
    return (
      <ReviewsContent>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={motionTransition}
          className="flex flex-col items-start gap-3 py-10"
        >
          <p className="text-md-medium text-gray-400">{props.message}</p>
          <button
            type="button"
            onClick={props.onRetry}
            className="text-md-semibold text-blue-300 underline"
          >
            {t('common.retry')}
          </button>
        </motion.div>
      </ReviewsContent>
    );
  }

  return (
    <ReviewsContent>
      <ReviewsEmptyState message={props.message} />
    </ReviewsContent>
  );
};
