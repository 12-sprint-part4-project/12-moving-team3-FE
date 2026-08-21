'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { Button, type ButtonVariant } from '@/components/Button/Button';
import { ChatStartButtonContent } from '@/components/chat/ChatStartButtonContent';
import { tapScale } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

export interface RequestCardAction {
  key: string;
  label: string;
  variant: ButtonVariant;
  showIcon: boolean;
  disabled?: boolean;
  /** 채팅하기 pending — 중앙 스피너만 표시 */
  isPending?: boolean;
  onClick: () => void;
}

export interface RequestCardActionButtonProps {
  size: 'sm' | 'md';
  action: RequestCardAction;
  className?: string;
}

/** 받은 요청 카드 CTA 한 개. */
export const RequestCardActionButton = ({
  size,
  action,
  className = '',
}: RequestCardActionButtonProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(
        'w-full min-w-0',
        size === 'sm' ? 'lg:hidden' : 'hidden lg:block lg:flex-1',
        className
      )}
      {...(shouldReduceMotion ? {} : tapScale)}
    >
      <Button
        size={size}
        variant={action.variant}
        showIcon={action.showIcon}
        disabled={action.disabled}
        aria-busy={action.key === 'chat' ? action.isPending : undefined}
        onClick={action.onClick}
        className="cursor-pointer"
      >
        {action.key === 'chat' ? (
          <ChatStartButtonContent isPending={action.isPending} />
        ) : (
          action.label
        )}
      </Button>
    </motion.div>
  );
};
