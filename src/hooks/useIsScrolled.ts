'use client';

import { useEffect, useState } from 'react';

const SCROLL_THRESHOLD_PX = 300;

/** 페이지 스크롤이 임계값(300px)을 넘었는지 여부 */
export const useIsScrolled = (): boolean => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return isScrolled;
};
