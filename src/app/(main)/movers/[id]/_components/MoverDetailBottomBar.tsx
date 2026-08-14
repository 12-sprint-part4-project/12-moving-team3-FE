'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { fadeUp, getMotionTransition } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

import { MOVERS_DETAIL_BOTTOM_BAR_CLASS } from '../../_components/moversLayout';

import { MoverDetailCtaButtons } from './MoverDetailCtaButtons';

import type {
  MoverDetailChat,
  MoverDetailDesignated,
  MoverDetailFavorite,
} from '../_lib/moverDetailActions';

export interface MoverDetailBottomBarProps {
  favorite: MoverDetailFavorite;
  designated: MoverDetailDesignated;
  chat: MoverDetailChat;
  className?: string;
}

/** Tablet / Mobile 하단 sticky — 찜 아이콘 + 지정 견적 CTA */
export const MoverDetailBottomBar = ({
  favorite,
  designated,
  chat,
  className = '',
}: MoverDetailBottomBarProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={motionTransition}
      className={cn(MOVERS_DETAIL_BOTTOM_BAR_CLASS, className)}
    >
      <div className="mx-auto flex w-full max-w-[37.5rem] items-center gap-2">
        <MoverDetailCtaButtons
          layout="bottomBar"
          favorite={favorite}
          designated={designated}
          chat={chat}
        />
      </div>
    </motion.div>
  );
};
