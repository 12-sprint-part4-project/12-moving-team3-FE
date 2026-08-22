'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useTranslation } from '@/i18n/useTranslation';
import { getFadeInPresenceProps, getMotionTransition } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

import type { Ref } from 'react';

export interface QuotesLoadMoreSentinelProps {
  loadMoreRef: Ref<HTMLDivElement>;
  isFetchingNextPage: boolean;
  message?: string;
  className?: string;
}

/** 무한 스크롤 sentinel + 더 불러오기 Spinner */
export const QuotesLoadMoreSentinel = ({
  loadMoreRef,
  isFetchingNextPage,
  message,
  className = '',
}: QuotesLoadMoreSentinelProps) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

  return (
    <div
      ref={loadMoreRef}
      className={cn('flex w-full justify-center py-2', className)}
    >
      <AnimatePresence>
        {isFetchingNextPage ? (
          <motion.div {...getFadeInPresenceProps(motionTransition)}>
            <Spinner message={message ?? t('common.loadMore')} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
