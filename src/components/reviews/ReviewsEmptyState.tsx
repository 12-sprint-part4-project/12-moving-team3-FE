'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

import { useTranslation } from '@/i18n/useTranslation';
import { fadeIn, floatY, getMotionTransition } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

export interface ReviewsEmptyStateProps {
  message?: string;
  className?: string;
}

/** 리뷰 목록 empty (Figma: img/Component/empty) */
export const ReviewsEmptyState = ({
  message,
  className,
}: ReviewsEmptyStateProps) => {
  const { t } = useTranslation();
  const resolvedMessage = message ?? t('reviews.writable.empty');
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="show"
      className={cn(
        'flex w-full flex-col items-center justify-center gap-6 py-16 xl:py-20',
        className
      )}
    >
      <motion.div
        {...(shouldReduceMotion ? {} : floatY)}
        className="flex items-center justify-center"
      >
        <Image
          src="/images/empty.svg"
          alt=""
          width={110}
          height={82}
          className="h-[5.125rem] w-[6.875rem]"
        />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.p
          key={resolvedMessage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={motionTransition}
          className="text-center text-lg-regular text-gray-400"
        >
          {resolvedMessage}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
};
