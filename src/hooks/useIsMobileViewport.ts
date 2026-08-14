'use client';

import { useEffect, useState } from 'react';

/** Tailwind `lg` (1024px) 미만 — 모바일·태블릿 세로 채팅 키보드 대응 */
const MOBILE_VIEWPORT_MQ = '(max-width: 1023px)';

/**
 * 채팅 키보드/페이지 스크롤 이슈는 모바일 뷰포트에서만 처리한다.
 * 데스크톱은 기존 document 레이아웃을 유지한다.
 */
export const useIsMobileViewport = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

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
