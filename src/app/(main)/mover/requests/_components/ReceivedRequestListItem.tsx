'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { getMotionTransition, listItemVariants } from '@/lib/motionVariants';

import { ReceivedRequestCard } from './ReceivedRequestCard';

import type { ReceivedRequestCardModel } from '@/types/estimateRequest';

export interface ReceivedRequestListItemProps {
  request: ReceivedRequestCardModel;
  shouldAnimate: boolean;
  onSendQuote: (request: ReceivedRequestCardModel) => void;
  onReject: (request: ReceivedRequestCardModel) => void;
  onChatClick: (request: ReceivedRequestCardModel) => void;
  isChatPending: boolean;
  onExitComplete: (id: number) => void;
}

/** 받은 요청 목록 한 줄. stagger on/off에 따라 layout·exit만 갈린다. */
export const ReceivedRequestListItem = ({
  request,
  shouldAnimate,
  onSendQuote,
  onReject,
  onChatClick,
  isChatPending,
  onExitComplete,
}: ReceivedRequestListItemProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

  return (
    <motion.li
      layout={shouldAnimate}
      variants={shouldAnimate ? listItemVariants : undefined}
      initial={shouldAnimate ? false : undefined}
      animate={shouldAnimate ? 'show' : undefined}
      exit={shouldAnimate ? 'exit' : undefined}
      transition={shouldAnimate ? motionTransition : undefined}
      onAnimationComplete={
        shouldAnimate
          ? (definition) => {
              if (definition === 'exit') {
                onExitComplete(request.id);
              }
            }
          : undefined
      }
      data-request-id={request.id}
      className="overflow-hidden"
    >
      <ReceivedRequestCard
        request={request}
        onSendQuote={onSendQuote}
        onReject={onReject}
        onChatClick={onChatClick}
        isChatPending={isChatPending}
      />
    </motion.li>
  );
};
