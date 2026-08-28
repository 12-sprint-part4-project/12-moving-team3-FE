'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

import { useTranslation } from '@/i18n/useTranslation';
import { fadeIn, floatY, getMotionTransition } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

import type { QuoteListStatus } from '@/types/quote';

export interface QuotesEmptyStateProps {
  status: QuoteListStatus;
  className?: string;
}

/** `/mover/quotes` 빈 목록 안내. - status별 문구. */
export const QuotesEmptyState = ({
  status,
  className = '',
}: QuotesEmptyStateProps) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const message =
    status === 'REJECTED' ? t('quotes.empty.rejected') : t('quotes.empty.sent');

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="show"
      transition={motionTransition}
      className={cn(
        'flex w-full flex-col items-center justify-center gap-8 py-16 lg:py-[11.25rem]',
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
          width={184}
          height={136}
          className="h-[8.5rem] w-[11.5rem]"
        />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={motionTransition}
          className="text-center text-xl-regular text-gray-400"
        >
          {message}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
};
