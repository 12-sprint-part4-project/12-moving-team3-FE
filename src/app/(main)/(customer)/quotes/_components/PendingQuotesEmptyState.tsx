'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { getButtonClassName } from '@/components/Button/Button';
import { fadeIn, floatY, getMotionTransition } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

export type PendingQuotesEmptyVariant =
  'waiting' | 'noRequest' | 'receivedEmpty' | 'historyEmpty';

export interface PendingQuotesEmptyStateProps {
  variant: PendingQuotesEmptyVariant;
  className?: string;
}

const EMPTY_COPY: Record<
  PendingQuotesEmptyVariant,
  { lines: string[]; actionHref?: string; actionLabel?: string }
> = {
  waiting: {
    lines: ['기사님들이 열심히 확인 중이에요', '곧 견적이 도착할 거예요!'],
  },
  noRequest: {
    lines: ['대기 중인 견적이 없어요!'],
    actionHref: '/estimates/request',
    actionLabel: '견적 요청하기',
  },
  receivedEmpty: {
    lines: ['아직 받았던 견적이 없어요!'],
  },
  historyEmpty: {
    lines: ['아직 이용 내역이 없어요!', '견적을 확정하면 여기에 표시돼요.'],
    actionHref: '/quotes',
    actionLabel: '대기 중인 견적 보기',
  },
};

/** 고객 내 견적 관리 빈 상태 */
export const PendingQuotesEmptyState = ({
  variant,
  className = '',
}: PendingQuotesEmptyStateProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const copy = EMPTY_COPY[variant];
  const messageKey = copy.lines.join('|');

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
