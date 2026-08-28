'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/Button/Button';
import { MoverDetailContentSkeleton } from '@/components/ui/Skeleton';
import { useTranslation } from '@/i18n/useTranslation';
import { fadeIn, getMotionTransition } from '@/lib/motionVariants';

export interface MoverDetailStatusProps {
  isValidMoverId: boolean;
  isPending: boolean;
  isNotFound: boolean;
  errorMessage: string;
  onRetry: () => void;
}

/** `/movers/[id]` 가드 UI. 잘못된 id·로딩·404·에러. */
export const MoverDetailStatus = ({
  isValidMoverId,
  isPending,
  isNotFound,
  errorMessage,
  onRetry,
}: MoverDetailStatusProps) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

  if (!isValidMoverId) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        transition={motionTransition}
        className="flex w-full flex-col items-center justify-center py-24"
      >
        <p className="text-lg-medium text-gray-400">{t('movers.invalid')}</p>
      </motion.div>
    );
  }

  if (isPending) {
    return <MoverDetailContentSkeleton />;
  }

  if (isNotFound) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        transition={motionTransition}
        className="flex w-full flex-col items-center justify-center py-24"
      >
        <p className="text-lg-medium text-gray-400">
          {t('movers.notFound')}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="show"
      transition={motionTransition}
      className="flex w-full flex-col items-center gap-4 py-24"
    >
      <p className="text-lg-medium text-gray-400">{errorMessage}</p>
      <Button
        type="button"
        variant="solid"
        size="sm"
        onClick={onRetry}
        className="w-auto"
      >
        {t('common.retry')}
      </Button>
    </motion.div>
  );
};
