'use client';

import { useEffect } from 'react';

/** globals.css / ChatRoomPage 높이 calc와 동기화 */
export const VISUAL_VIEWPORT_HEIGHT_VAR = '--visual-viewport-height';

/**
 * 모바일에서 `visualViewport` 높이를 CSS 변수로만 반영한다.
 * 키보드가 열리면 값이 줄어들고, 채팅방 `calc(var(--visual-viewport-height) - GNB)`가
 * 같이 줄어든다. body 크기를 바꾸지 않아 메시지 리스트 스크롤은 유지된다 (#279).
 *
 * `useBodyScrollLock` 이후에 호출한다.
 */
export const useVisualViewportHeight = (enabled = true) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const root = document.documentElement;

    const sync = () => {
      const height = window.visualViewport?.height ?? window.innerHeight;
      root.style.setProperty(VISUAL_VIEWPORT_HEIGHT_VAR, `${height}px`);

      // 페이지(문서)가 포커스로 밀린 경우만 보정 — 리스트 스크롤과 무관
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
