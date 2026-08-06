'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import ChevronUpIcon from '@/assets/icons/chevron-up.svg';
import {
  FLOATING_ACTION_BASE_POSITION_CLASS,
  SCROLL_TO_TOP_BUTTON_SIZE_CLASS,
  SCROLL_TO_TOP_DESKTOP_POSITION_CLASS,
  SCROLL_TO_TOP_ICON_CLASS,
  SCROLL_TO_TOP_TABLET_POSITION_CLASS,
} from '@/constants/floatingActionLayout';
import { getScrollToTopConfig } from '@/lib/scrollToTopConfig';
import { cn } from '@/lib/utils';

const SCROLL_THRESHOLD_PX = 300;
const TABLET_MIN_WIDTH_QUERY = '(min-width: 46.5rem)';

/** 전역 맨 위로 플로팅 버튼 — Mobile 항상 / Tablet·Desktop 스크롤 시 */
export const ScrollToTopButton = () => {
  const pathname = usePathname();
  const { visible } = getScrollToTopConfig(pathname);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTabletOrDesktop, setIsTabletOrDesktop] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const mediaQuery = window.matchMedia(TABLET_MIN_WIDTH_QUERY);

    const updateViewport = () => {
      setIsTabletOrDesktop(mediaQuery.matches);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    };

    updateViewport();
    handleScroll();

    mediaQuery.addEventListener('change', updateViewport);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      mediaQuery.removeEventListener('change', updateViewport);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [visible, pathname]);

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!visible) {
    return null;
  }

  const isShownOnTabletOrDesktop = isScrolled;
  const isHiddenOnTabletOrDesktop = isTabletOrDesktop && !isShownOnTabletOrDesktop;

  return (
    <button
      type="button"
      aria-label="맨 위로"
      onClick={handleClick}
      className={cn(
        'fixed z-40 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-3xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.18)] hover:bg-background-200',
        SCROLL_TO_TOP_BUTTON_SIZE_CLASS,
        FLOATING_ACTION_BASE_POSITION_CLASS,
        SCROLL_TO_TOP_TABLET_POSITION_CLASS,
        SCROLL_TO_TOP_DESKTOP_POSITION_CLASS,
        isHiddenOnTabletOrDesktop
          ? 'pointer-events-none opacity-0'
          : 'opacity-100'
      )}
    >
      <ChevronUpIcon
        className={cn(SCROLL_TO_TOP_ICON_CLASS, 'text-blue-300')}
        aria-hidden
      />
    </button>
  );
};
