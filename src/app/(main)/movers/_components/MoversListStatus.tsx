'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/Button/Button';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { fadeIn, getMotionTransition } from '@/lib/motionVariants';

import { MoversEmptyState } from './MoversEmptyState';

export interface MoversListStatusProps {
  isPending: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
  onResetEmpty?: () => void;
}

/**
 * `/movers` 목록 패널 가드 UI.
 * 로딩·에러·empty. 언제 보여줄지는 패널 early return이 담당한다.
 */
export const MoversListStatus = ({
  isPending,
  isError,
  errorMessage,
  onRetry,
  onResetEmpty,
}: MoversListStatusProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

  if (isPending) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        transition={motionTransition}
      >
        <Spinner message="기사님 목록을 불러오는 중..." />
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        transition={motionTransition}
        className="flex flex-col items-center gap-4 py-16"
      >
        <p className="text-lg-medium text-gray-400">{errorMessage}</p>
        <Button
          type="button"
          variant="solid"
          size="sm"
          onClick={onRetry}
          className="w-auto"
        >
          다시 시도
        </Button>
      </motion.div>
    );
  }

  return <MoversEmptyState onReset={onResetEmpty} />;
};
