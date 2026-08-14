'use client';

import { useEffect } from 'react';

/** globals.css / ChatRoomPage 높이 calc와 동기화 */
export const VISUAL_VIEWPORT_HEIGHT_VAR = '--visual-viewport-height';
export const VISUAL_VIEWPORT_OFFSET_TOP_VAR = '--visual-viewport-offset-top';

/**
 * `visualViewport` 높이를 CSS 변수로 반영하고,
 * 잠긴 body를 가시 영역(키보드 위)에 맞춰 top/height로 고정한다 (#279).
 *
 * `useBodyScrollLock` 이후에 호출해야 진입 전 scrollY가 보존된다.
 */
export const useVisualViewportHeight = (enabled = true) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const root = document.documentElement;
    const { body } = document;

    const sync = () => {
      const vv = window.visualViewport;
      const height = vv?.height ?? window.innerHeight;
      const offsetTop = vv?.offsetTop ?? 0;

      root.style.setProperty(VISUAL_VIEWPORT_HEIGHT_VAR, `${height}px`);
      root.style.setProperty(VISUAL_VIEWPORT_OFFSET_TOP_VAR, `${offsetTop}px`);

      // 가시 영역에 body를 고정 → 문서가 밀려 흰 화면으로 떨어지는 것 방지
      body.style.top = `${offsetTop}px`;
      body.style.height = `${height}px`;
      body.style.maxHeight = `${height}px`;
      body.style.minHeight = `${height}px`;

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
      root.style.removeProperty(VISUAL_VIEWPORT_OFFSET_TOP_VAR);
    };
  }, [enabled]);
};
