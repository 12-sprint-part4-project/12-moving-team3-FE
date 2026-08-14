'use client';

import { useEffect } from 'react';

/** globals.css / ChatRoomPage 높이 calc와 동기화 */
export const VISUAL_VIEWPORT_HEIGHT_VAR = '--visual-viewport-height';

/**
 * `visualViewport` 높이를 CSS 변수로 반영한다.
 * 모바일 키보드·주소창에 맞춰 채팅방 등 full-height 레이아웃을 줄일 때 사용.
 * 언마운트 시 변수를 제거해 다른 페이지에 영향을 주지 않는다.
 */
export const useVisualViewportHeight = (enabled = true) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const root = document.documentElement;

    const sync = () => {
      const vv = window.visualViewport;
      const height = vv?.height ?? window.innerHeight;
      root.style.setProperty(VISUAL_VIEWPORT_HEIGHT_VAR, `${height}px`);

      // fixed body lock과 함께, 포커스 스크롤·visualViewport offset 잔여를 보정
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    };

    sync();

    const vv = window.visualViewport;
    vv?.addEventListener('resize', sync);
    vv?.addEventListener('scroll', sync);
    window.addEventListener('resize', sync);

    return () => {
      vv?.removeEventListener('resize', sync);
      vv?.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
      root.style.removeProperty(VISUAL_VIEWPORT_HEIGHT_VAR);
    };
  }, [enabled]);
};
