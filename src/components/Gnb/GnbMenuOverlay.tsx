'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { GnbMenu, type GnbMenuProps } from '@/components/Gnb/GnbMenu';
import {
  sideDrawerDimmerVariants,
  sideDrawerPanelVariants,
} from '@/lib/motionVariants';

export interface GnbMenuOverlayProps extends Omit<GnbMenuProps, 'onClose'> {
  isOpen: boolean;
  onClose: () => void;
}

const REDUCED_DIMMER_VARIANTS = {
  hidden: { opacity: 1 },
  show: { opacity: 1 },
  exit: { opacity: 1 },
};

const REDUCED_PANEL_VARIANTS = {
  hidden: { x: 0 },
  show: { x: 0 },
  exit: { x: 0 },
};

/** 모바일/태블릿 GNB 사이드 메뉴 오버레이 — 오른쪽에서 슬라이드 */
export const GnbMenuOverlay = ({
  isOpen,
  onClose,
  type,
  navItems,
  onLogout,
  className,
}: GnbMenuOverlayProps) => {
  const shouldReduceMotion = useReducedMotion();
  const dimmerVariants = shouldReduceMotion
    ? REDUCED_DIMMER_VARIANTS
    : sideDrawerDimmerVariants;
  const panelVariants = shouldReduceMotion
    ? REDUCED_PANEL_VARIANTS
    : sideDrawerPanelVariants;

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.button
          key="gnb-menu-dimmer"
          type="button"
          aria-label="메뉴 닫기"
          variants={dimmerVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-50 bg-black-500/40 lg:hidden"
          onClick={onClose}
        />
      ) : null}
      {isOpen ? (
        <motion.div
          key="gnb-menu-panel"
          variants={panelVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-y-0 right-0 z-50 h-full lg:hidden"
        >
          <GnbMenu
            type={type}
            navItems={navItems}
            onClose={onClose}
            onLogout={onLogout}
            className={className}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
