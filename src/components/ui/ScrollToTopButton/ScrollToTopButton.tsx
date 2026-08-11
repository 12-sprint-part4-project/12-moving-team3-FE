'use client';

import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

import ChevronUpIcon from '@/assets/icons/chevron-up.svg';
import {
  FLOATING_ACTION_BUTTON_SIZE_CLASS,
  FLOATING_ACTION_FIXED_CLASS,
  FLOATING_ACTION_ICON_CLASS,
  FLOATING_ACTION_INSET_X_CLASS,
  SCROLL_TO_TOP_DESKTOP_BOTTOM_CLASS,
  SCROLL_TO_TOP_TABLET_BOTTOM_CLASS,
} from '@/constants/floatingActionLayout';
import { useFloatingActionScrollVisibility } from '@/hooks/useFloatingActionScrollVisibility';
import { getScrollToTopConfig } from '@/lib/scrollToTopConfig';
import { cn } from '@/lib/utils';

interface ScrollToTopButtonProps {
  className?: string;
}

/** 전역 맨 위로 플로팅 버튼 */
export const ScrollToTopButton = ({
  className = '',
}: ScrollToTopButtonProps) => {
  const pathname = usePathname();
  const { visible, mobileBottomClass } = getScrollToTopConfig(pathname);
  const visibilityClass = useFloatingActionScrollVisibility();

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="맨 위로"
      onClick={handleClick}
      className={cn(
        FLOATING_ACTION_FIXED_CLASS,
        'bg-white hover:bg-background-200',
        FLOATING_ACTION_BUTTON_SIZE_CLASS,
        FLOATING_ACTION_INSET_X_CLASS,
        mobileBottomClass,
        SCROLL_TO_TOP_TABLET_BOTTOM_CLASS,
        SCROLL_TO_TOP_DESKTOP_BOTTOM_CLASS,
        visibilityClass,
        className
      )}
    >
      <ChevronUpIcon
        className={cn(FLOATING_ACTION_ICON_CLASS, 'text-blue-300')}
        aria-hidden
      />
    </button>
  );
};
