'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

import { fadeIn, floatY, getMotionTransition } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';
import type { QuoteListStatus } from '@/types/quote';

export interface QuotesEmptyStateProps {
  status: QuoteListStatus;
  className?: string;
}

const EMPTY_MESSAGE: Record<QuoteListStatus, string> = {
  SENT: '아직 보낸 견적이 없어요!',
  REJECTED: '아직 반려한 요청이 없어요!',
};

/** 내 견적 관리 빈 목록 안내 표시 */
export const QuotesEmptyState = ({
  status,
  className = '',
}: QuotesEmptyStateProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const message = EMPTY_MESSAGE[status];

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
