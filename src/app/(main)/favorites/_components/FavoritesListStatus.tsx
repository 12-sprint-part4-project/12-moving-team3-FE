'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/Button/Button';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useTranslation } from '@/i18n/useTranslation';
import { fadeIn, getMotionTransition } from '@/lib/motionVariants';

import { FavoritesEmptyState } from './FavoritesEmptyState';

export interface FavoritesListStatusProps {
  isPending: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
}

/**
 * `/favorites` 목록 패널 가드 UI.
 * 로딩·에러·empty. 언제 보여줄지는 패널 early return이 담당한다.
 */
export const FavoritesListStatus = ({
  isPending,
  isError,
  errorMessage,
  onRetry,
}: FavoritesListStatusProps) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

  if (isPending) {
    return <Spinner message={t('movers.favoritesLoadingAria')} />;
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
          {t('common.retry')}
        </Button>
      </motion.div>
    );
  }

  return <FavoritesEmptyState />;
};
