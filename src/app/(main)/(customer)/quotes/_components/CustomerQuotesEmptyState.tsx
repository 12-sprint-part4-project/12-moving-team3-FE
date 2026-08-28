'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { getButtonClassName } from '@/components/Button/Button';
import { useTranslation } from '@/i18n/useTranslation';
import { fadeIn, floatY, getMotionTransition } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

export type CustomerQuotesEmptyVariant =
  'waiting' | 'noRequest' | 'receivedEmpty' | 'historyEmpty';

export interface CustomerQuotesEmptyStateProps {
  variant: CustomerQuotesEmptyVariant;
  className?: string;
}

export const CustomerQuotesEmptyState = ({
  variant,
  className = '',
}: CustomerQuotesEmptyStateProps) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const copy = {
    waiting: {
      lines: [t('quotes.empty.waiting1'), t('quotes.empty.waiting2')],
    },
    noRequest: {
      lines: [t('quotes.empty.noRequest')],
      actionHref: '/estimates/request',
      actionLabel: t('quotes.empty.requestCta'),
    },
    receivedEmpty: {
      lines: [t('quotes.empty.received')],
    },
    historyEmpty: {
      lines: [t('quotes.empty.history1'), t('quotes.empty.history2')],
      actionHref: '/quotes',
      actionLabel: t('quotes.empty.historyCta'),
    },
  }[variant];

  const motionTransition = getMotionTransition(shouldReduceMotion);
  const messageKey = copy.lines.join('|');

  // 빈 이미지 + 안내 문구 + (선택) CTA
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="show"
      transition={motionTransition}
      className={cn(
        'flex w-full flex-col items-center justify-center gap-6 py-16 lg:gap-8 lg:py-[11.25rem]',
        className
      )}
      role="status"
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
          className="h-34 w-46"
        />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div
          key={messageKey}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={motionTransition}
          className="flex flex-col items-center gap-1"
        >
          {copy.lines.map((line) => (
            <p
              key={line}
              className="text-center text-lg-regular text-gray-400 lg:text-xl-regular"
            >
              {line}
            </p>
          ))}
        </motion.div>
      </AnimatePresence>
      {copy.actionHref && copy.actionLabel ? (
        <Link
          href={copy.actionHref}
          className={getButtonClassName({
            size: 'sm',
            variant: 'solid',
            className: cn(
              'max-w-[12rem]',
              'focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:outline-none'
            ),
          })}
        >
          {copy.actionLabel}
        </Link>
      ) : null}
    </motion.div>
  );
};
