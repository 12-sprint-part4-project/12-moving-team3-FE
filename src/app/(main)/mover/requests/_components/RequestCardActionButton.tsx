'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { Button, type ButtonVariant } from '@/components/Button/Button';
import { getMotionTransition, tapScale } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

export interface RequestCardAction {
  key: string;
  label: string;
  variant: ButtonVariant;
  showIcon: boolean;
  disabled?: boolean;
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
  const motionTransition = getMotionTransition(shouldReduceMotion);

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
        onClick={action.onClick}
        className="cursor-pointer"
      >
        {action.key === 'chat' ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={action.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={motionTransition}
            >
              {action.label}
            </motion.span>
          </AnimatePresence>
        ) : (
          action.label
        )}
      </Button>
    </motion.div>
  );
};
