'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/Button/Button';
import { useTranslation } from '@/i18n/useTranslation';
import { fadeIn, getMotionTransition } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

export interface QuotesListErrorStateProps {
  message: string;
  onRetry: () => void;
  /** false면 fadeIn 없이 정적 렌더 (탭 패널 등) */
  withMotion?: boolean;
  className?: string;
}

/** 견적 목록·이용 내역 공통 에러 + 다시 시도 */
export const QuotesListErrorState = ({
  message,
  onRetry,
  withMotion = true,
  className = '',
}: QuotesListErrorStateProps) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

  const content = (
    <>
      <p role="alert" className="text-center text-lg-medium text-red-200">
        {message}
      </p>
      <Button
        size="sm"
        variant="outlined"
        className="max-w-[10rem]"
        onClick={onRetry}
      >
        {t('common.retry')}
      </Button>
    </>
  );

  if (!withMotion) {
    return (
      <div
        className={cn(
          'flex flex-col items-center gap-4 py-16',
          className
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="show"
      transition={motionTransition}
      className={cn('flex flex-col items-center gap-4 py-16', className)}
    >
      {content}
    </motion.div>
  );
};
