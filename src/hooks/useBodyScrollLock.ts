'use client';

import { useEffect, useRef } from 'react';

/**
 * 마운트(또는 enabled) 동안 `document.body` 스크롤을 잠근다.
 * Modal / GnbMenuOverlay와 동일한 overflow 복원 패턴.
 */
export const useBodyScrollLock = (enabled = true) => {
  const previousOverflowRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflowRef.current ?? '';
      previousOverflowRef.current = undefined;
    };
  }, [enabled]);
};
