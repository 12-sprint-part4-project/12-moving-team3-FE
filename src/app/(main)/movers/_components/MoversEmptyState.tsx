'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/Button/Button';
import { fadeIn, floatY, getMotionTransition } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

export interface MoversEmptyStateProps {
  onReset?: () => void;
  className?: string;
}

/** 기사님 찾기 빈 목록 안내 표시 */
export const MoversEmptyState = ({
  onReset,
  className = '',
}: MoversEmptyStateProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="show"
      className={cn(
        'flex w-full flex-col items-center justify-center gap-8 py-16',
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

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={motionTransition}
        className="text-center text-xl-regular text-gray-400"
      >
        조건에 맞는 기사님이 없어요.
      </motion.p>

      {onReset ? (
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
