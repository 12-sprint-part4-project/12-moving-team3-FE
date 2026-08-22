'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

import { Button } from '@/components/Button/Button';
import { useTranslation } from '@/i18n/useTranslation';
import { fadeIn, floatY, getMotionTransition } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

export type RequestsEmptyStateVariant = 'initial' | 'filtered';

export interface RequestsEmptyStateProps {
  variant?: RequestsEmptyStateVariant;
  onReset?: () => void;
  className?: string;
}

/** 받은 요청 빈 목록 안내 표시 */
export const RequestsEmptyState = ({
  variant = 'initial',
  onReset,
  className = '',
}: RequestsEmptyStateProps) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const emptyMessage =
    variant === 'initial'
      ? t('receivedRequests.emptyInitial')
      : t('receivedRequests.emptyFiltered');

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
          {emptyMessage}
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
            {t('common.reset')}
          </Button>
        </motion.div>
      ) : null}
    </motion.div>
  );
};
