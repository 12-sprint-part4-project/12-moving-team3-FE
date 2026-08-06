'use client';

import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

import ChevronUpIcon from '@/assets/icons/chevron-up.svg';
import {
  FLOATING_ACTION_BASE_POSITION_CLASS,
  FLOATING_ACTION_BUTTON_SIZE_CLASS,
  FLOATING_ACTION_FIXED_CLASS,
  SCROLL_TO_TOP_DESKTOP_BOTTOM_CLASS,
  SCROLL_TO_TOP_ICON_CLASS,
  SCROLL_TO_TOP_TABLET_BOTTOM_CLASS,
} from '@/constants/floatingActionLayout';
import { useFloatingActionScrollVisibility } from '@/hooks/useFloatingActionScrollVisibility';
import { isScrollToTopVisible } from '@/lib/scrollToTopConfig';
import { cn } from '@/lib/utils';

/** 전역 맨 위로 플로팅 버튼 — Mobile 항상 / Tablet·Desktop 스크롤 시 */
export const ScrollToTopButton = () => {
  const pathname = usePathname();
  const visible = isScrollToTopVisible(pathname);
  const visibilityClass = useFloatingActionScrollVisibility(visible);

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
        FLOATING_ACTION_BASE_POSITION_CLASS,
        SCROLL_TO_TOP_TABLET_BOTTOM_CLASS,
        SCROLL_TO_TOP_DESKTOP_BOTTOM_CLASS,
        visibilityClass
      )}
    >
      <ChevronUpIcon
        className={cn(SCROLL_TO_TOP_ICON_CLASS, 'text-blue-300')}
        aria-hidden
      />
    </button>
  );
};
