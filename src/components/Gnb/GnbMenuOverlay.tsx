'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

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

/** Tab 순환 대상 — 비활성·숨김 필드는 제외한다. */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const getFocusableElements = (container: HTMLElement): HTMLElement[] =>
  Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter((element) => {
    if (element.closest('[aria-hidden="true"], [hidden]')) return false;
    return element.getClientRects().length > 0;
  });

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
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const previousOverflowRef = useRef<string | undefined>(undefined);

  const dimmerVariants = shouldReduceMotion
    ? REDUCED_DIMMER_VARIANTS
    : sideDrawerDimmerVariants;
  const panelVariants = shouldReduceMotion
    ? REDUCED_PANEL_VARIANTS
    : sideDrawerPanelVariants;

  const unlockBodyScroll = () => {
    if (previousOverflowRef.current === undefined) return;
    document.body.style.overflow = previousOverflowRef.current;
    previousOverflowRef.current = undefined;
  };

  useEffect(() => {
    if (!isOpen) return;
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => unlockBodyScroll();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const focusables = getFocusableElements(panel);
    (focusables[0] ?? panel).focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const elements = getFocusableElements(panel);
      if (elements.length === 0) {
        event.preventDefault();
        panel.focus({ preventScroll: true });
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];
      const active = document.activeElement;
      const focusOutside = !(active instanceof Node) || !panel.contains(active);

      if (event.shiftKey) {
        if (focusOutside || active === first) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        }
        return;
      }

      if (focusOutside || active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      const previous = previousFocusRef.current;
      if (previous && document.contains(previous)) {
        previous.focus({ preventScroll: true });
      }
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence onExitComplete={() => (!isOpen ? unlockBodyScroll() : undefined)}>
      {isOpen ? (
        <motion.div
          key="gnb-menu-dimmer"
          role="presentation"
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
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="메뉴"
          variants={panelVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-y-0 right-0 z-50 h-full outline-none lg:hidden"
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
