'use client';

import { useEffect, useState } from 'react';

const SCROLL_THRESHOLD_PX = 300;
const TABLET_MIN_WIDTH_QUERY = '(min-width: 46.5rem)';

/** Mobile 항상 노출 / Tablet·Desktop 페이지 top에선 숨김 */
export const useFloatingActionScrollVisibility = (
  enabled = true
): string => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTabletOrDesktop, setIsTabletOrDesktop] = useState(false);

  useEffect(() => {
    if (!enabled) {
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
  }, [enabled]);

  if (!enabled) {
    return 'opacity-100';
  }

  return isTabletOrDesktop && !isScrolled
    ? 'pointer-events-none opacity-0'
    : 'opacity-100';
};
