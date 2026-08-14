'use client';

import { useEffect, useRef } from 'react';

interface BodyScrollLockSnapshot {
  bodyOverflow: string;
  bodyPosition: string;
  bodyTop: string;
  bodyLeft: string;
  bodyRight: string;
  bodyWidth: string;
  htmlOverflow: string;
  htmlOverscrollBehavior: string;
  scrollY: number;
}

/**
 * 채팅방 등에서 문서 스크롤을 잠근다.
 * iOS/인앱은 overflow:hidden만으로 키보드 포커스 스크롤을 막지 못해
 * body를 position:fixed로 고정한다 (#279).
 */
export const useBodyScrollLock = (enabled = true) => {
  const snapshotRef = useRef<BodyScrollLockSnapshot | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const { body, documentElement: html } = document;
    const scrollY = window.scrollY;

    snapshotRef.current = {
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      htmlOverflow: html.style.overflow,
      htmlOverscrollBehavior: html.style.overscrollBehavior,
      scrollY,
    };

    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';

    return () => {
      const snapshot = snapshotRef.current;
      if (!snapshot) {
        return;
      }

      body.style.overflow = snapshot.bodyOverflow;
      body.style.position = snapshot.bodyPosition;
      body.style.top = snapshot.bodyTop;
      body.style.left = snapshot.bodyLeft;
      body.style.right = snapshot.bodyRight;
      body.style.width = snapshot.bodyWidth;
      html.style.overflow = snapshot.htmlOverflow;
      html.style.overscrollBehavior = snapshot.htmlOverscrollBehavior;
      snapshotRef.current = null;

      window.scrollTo(0, snapshot.scrollY);
    };
  }, [enabled]);
};
