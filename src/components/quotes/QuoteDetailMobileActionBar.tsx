'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { fadeUp, getMotionTransition } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

export interface QuoteDetailMobileActionBarProps {
  children: ReactNode;
  className?: string;
}

/** 견적 상세 모바일·태블릿 하단 고정 CTA 바 */
export const QuoteDetailMobileActionBar = ({
  children,
  className = '',
}: QuoteDetailMobileActionBarProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={motionTransition}
      className={cn(
        'fixed inset-x-0 bottom-0 z-20 border-t border-line-100 bg-white px-6 py-2.5 md:px-[4.5rem] lg:hidden',
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[37.5rem] items-center gap-2">
        {children}
      </div>
    </motion.div>
  );
};
