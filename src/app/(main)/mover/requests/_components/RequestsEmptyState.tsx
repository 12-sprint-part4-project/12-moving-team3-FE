'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/Button/Button';
import { fadeIn, floatY, getMotionTransition } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

export type RequestsEmptyStateVariant = 'initial' | 'filtered';

export interface RequestsEmptyStateProps {
  variant?: RequestsEmptyStateVariant;
  onReset?: () => void;
  className?: string;
}

const EMPTY_MESSAGE: Record<RequestsEmptyStateVariant, string> = {
  initial: '아직 받은 요청이 없어요!',
  filtered: '조건에 맞는 요청이 없어요.',
};

/** 받은 요청 빈 목록 안내 표시 */
export const RequestsEmptyState = ({
  variant = 'initial',
  onReset,
  className = '',
}: RequestsEmptyStateProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="show"
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
          key={variant}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={motionTransition}
          className="text-center text-xl-regular text-gray-400"
        >
          {EMPTY_MESSAGE[variant]}
        </motion.p>
      </AnimatePresence>

      {variant === 'filtered' && onReset ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            ...motionTransition,
            delay: shouldReduceMotion ? 0 : 0.1,
          }}
        >
          <Button
            size="sm"
            variant="outlined"
            className="max-w-[12rem]"
            onClick={onReset}
          >
            필터 초기화
          </Button>
        </motion.div>
      ) : null}
    </motion.div>
  );
};
