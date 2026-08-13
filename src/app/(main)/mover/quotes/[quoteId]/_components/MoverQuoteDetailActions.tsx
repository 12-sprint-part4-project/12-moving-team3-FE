'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/Button/Button';
import { fadeUp, getMotionTransition } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

export interface MoverQuoteDetailActionsProps {
  canStartChat: boolean;
  isChatPending?: boolean;
  onChatClick: () => void;
  variant: 'desktop' | 'mobile';
  className?: string;
}

/** 기사님 견적 상세 채팅 액션 */
export const MoverQuoteDetailActions = ({
  canStartChat,
  isChatPending = false,
  onChatClick,
  variant,
  className = '',
}: MoverQuoteDetailActionsProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

  if (!canStartChat) {
    return null;
  }

  if (variant === 'desktop') {
    return (
      <div className={cn('w-full', className)}>
        <Button
          size="md"
          variant="outlined"
          disabled={isChatPending}
          onClick={onChatClick}
        >
          {isChatPending ? '연결 중...' : '채팅하기'}
        </Button>
      </div>
    );
  }

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
        <Button
          size="sm"
          variant="solid"
          className="w-full"
          disabled={isChatPending}
          onClick={onChatClick}
        >
          {isChatPending ? '연결 중...' : '채팅하기'}
        </Button>
      </div>
    </motion.div>
  );
};
