'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/Button/Button';
import { useTranslation } from '@/i18n/useTranslation';
import { fadeIn, getMotionTransition } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

export interface QuoteDetailErrorStateProps {
  message: string;
  backHref: string;
  /** 기본: 내 견적 관리로 돌아가기 */
  backLabel?: string;
  /** 있으면 다시 시도 버튼 노출 */
  onRetry?: () => void;
  className?: string;
}

/** 견적 상세 — 잘못된 id·fetch 에러 공통 상태 */
export const QuoteDetailErrorState = ({
  message,
  backHref,
  backLabel,
  onRetry,
  className = '',
}: QuoteDetailErrorStateProps) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="show"
      transition={motionTransition}
      className={cn(
        'flex min-h-full w-full flex-col items-center justify-center gap-4 bg-white py-16',
        className
      )}
    >
      <p role="alert" className="text-center text-lg-medium text-red-200">
        {message}
      </p>
      {onRetry ? (
        <Button
          size="sm"
          variant="outlined"
          className="max-w-40"
          onClick={onRetry}
        >
          {t('common.retry')}
        </Button>
      ) : null}
      <Link
        href={backHref}
        className="text-lg-semibold text-blue-300 underline-offset-2 hover:underline"
      >
        {backLabel ?? t('quotes.backToList')}
      </Link>
    </motion.div>
  );
};
