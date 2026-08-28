'use client';

import { useEffect, useState } from 'react';

/** Tailwind `lg` (1024px) 미만 — 모바일·태블릿 세로 채팅 키보드 대응 */
export const MOBILE_VIEWPORT_MQ = '(max-width: 1023px)';

const getIsMobileViewport = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia(MOBILE_VIEWPORT_MQ).matches;
};

/**
 * 채팅 키보드/페이지 스크롤 이슈는 모바일 뷰포트에서만 처리한다.
 * 데스크톱은 기존 document 레이아웃을 유지한다.
 */
export const useIsMobileViewport = (): boolean => {
  const [isMobile, setIsMobile] = useState(getIsMobileViewport);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_VIEWPORT_MQ);
    const sync = () => {
      setIsMobile(media.matches);
    };

    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return isMobile;
};
