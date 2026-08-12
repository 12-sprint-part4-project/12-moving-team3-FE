'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { MoverShareButtons } from '@/components/movers/MoverShareButtons';
import { fadeUp, getMotionTransition } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

import { MoverDetailCtaButtons } from './MoverDetailCtaButtons';
import type {
  MoverDetailChat,
  MoverDetailDesignated,
  MoverDetailFavorite,
  MoverDetailShare,
} from '../_lib/moverDetailActions';

export interface MoverDetailSidebarProps {
  favorite: MoverDetailFavorite;
  designated: MoverDetailDesignated;
  chat: MoverDetailChat;
  share: MoverDetailShare;
  className?: string;
}

/** Desktop 우측 — 지정 견적 CTA · 찜 · 공유 */
export const MoverDetailSidebar = ({
  favorite,
  designated,
  chat,
  share,
  className = '',
}: MoverDetailSidebarProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={motionTransition}
      className={cn(
        'flex w-full max-w-[22.125rem] shrink-0 flex-col gap-10',
        className
      )}
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4"
      >
        <MoverDetailCtaButtons
          layout="sidebar"
          name={share.name}
          favorite={favorite}
          designated={designated}
          chat={chat}
        />
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{
          ...motionTransition,
          delay: shouldReduceMotion ? 0 : 0.08,
        }}
        className="flex flex-col gap-[1.375rem] border-t border-line-100 pt-10"
      >
        <p className="text-xl-semibold text-black-400">
          나만 알기엔 아쉬운 기사님인가요?
        </p>
        <MoverShareButtons
          size="md"
          name={share.name}
          description={share.description}
          profileImageUrl={share.profileImageUrl}
        />
      </motion.div>
    </motion.aside>
  );
};
