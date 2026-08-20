'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { useIsMobileViewport } from '@/hooks/useIsMobileViewport';
import { getChatRouteDirection } from '@/lib/chatRouteTransition';
import { getChatRoutePanelMotionProps } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

export interface ChatRouteTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/** `/chat` ↔ `/chat/[roomId]` 페이지 전환 — 페이지 래퍼 1곳에서만 animate */
export const ChatRouteTransition = ({
  children,
  className,
}: ChatRouteTransitionProps) => {
  const pathname = usePathname();
  const [routeSnapshot, setRouteSnapshot] = useState(() => ({
    pathname,
    direction: getChatRouteDirection(null, pathname),
  }));

  let direction = routeSnapshot.direction;
  if (routeSnapshot.pathname !== pathname) {
    direction = getChatRouteDirection(routeSnapshot.pathname, pathname);
    setRouteSnapshot({ pathname, direction });
  }

  const isMobile = useIsMobileViewport();
  const shouldReduceMotion = useReducedMotion();
  const motionProps = getChatRoutePanelMotionProps({
    direction,
    isMobile,
    shouldReduceMotion,
  });

  return (
    <div
      className={cn(
        'flex min-h-0 w-full flex-1 flex-col overflow-x-hidden',
        className
      )}
    >
      <AnimatePresence
        mode="wait"
        custom={direction}
        initial={direction !== 0}
      >
        <motion.div
          key={pathname}
          {...motionProps}
          className="flex min-h-0 w-full flex-1 flex-col"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
