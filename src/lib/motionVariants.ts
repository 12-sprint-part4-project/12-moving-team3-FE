import type { HTMLMotionProps, Transition, Variants } from 'framer-motion';

/** prefers-reduced-motion 대응 transition */
export const getMotionTransition = (
  shouldReduceMotion: boolean | null,
  transition: Transition = { duration: 0.22 }
): Transition => (shouldReduceMotion ? { duration: 0 } : transition);

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

export const listStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

/** prefers-reduced-motion이면 stagger 없이 동시 전환 */
export const getListStagger = (
  shouldReduceMotion: boolean | null
): Variants =>
  shouldReduceMotion
    ? {
        hidden: {},
        show: {
          transition: { staggerChildren: 0, delayChildren: 0 },
        },
      }
    : listStagger;

export const cardExit: Variants = {
  exit: {
    opacity: 0,
    height: 0,
    marginBottom: 0,
    transition: { duration: 0.28, ease: 'easeInOut' },
  },
};

/** 목록 아이템 entrance(fadeUp) + exit(cardExit) */
export const listItemVariants: Variants = {
  hidden: fadeUp.hidden,
  show: fadeUp.show,
  exit: cardExit.exit,
};

export const dimmerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

export const centerModalPanelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 28, stiffness: 320 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: { duration: 0.15 },
  },
};

export const bottomSheetPanelVariants: Variants = {
  hidden: { y: '100%' },
  show: {
    y: 0,
    transition: { type: 'spring', damping: 28, stiffness: 320 },
  },
  exit: {
    y: '100%',
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export const tabContentSlide: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 16 : -16,
  }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -16 : 16,
  }),
};

/** Sort·필터 등 트리거 아래 드롭다운 패널 */
export const dropdownPanelVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

export const floatY = {
  animate: {
    y: [0, -4, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
} satisfies HTMLMotionProps<'div'>;

export const tapScale = {
  whileTap: { scale: 0.97 },
} satisfies HTMLMotionProps<'div'>;

export const cardHover = {
  whileHover: { y: -2, transition: { duration: 0.15 } },
} satisfies HTMLMotionProps<'div'>;
