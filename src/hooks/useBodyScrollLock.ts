'use client';

import { useEffect, useRef } from 'react';

interface BodyScrollLockSnapshot {
  bodyOverflow: string;
  bodyOverflowX: string;
  bodyPosition: string;
  bodyTop: string;
  bodyLeft: string;
  bodyRight: string;
  bodyWidth: string;
  bodyMinHeight: string;
  htmlOverflow: string;
  htmlOverscrollBehavior: string;
  scrollY: number;
}

/**
 * 모바일 채팅방에서만 문서(페이지) 스크롤을 잠근다.
 * 메시지 목록(`overflow-y-auto`) 스크롤은 건드리지 않는다 (#279).
 *
 * `useVisualViewportHeight`보다 먼저 호출해 진입 시점 scrollY를 보존한다.
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
      bodyOverflowX: body.style.overflowX,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyMinHeight: body.style.minHeight,
      htmlOverflow: html.style.overflow,
      htmlOverscrollBehavior: html.style.overscrollBehavior,
      scrollY,
    };

    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    body.style.overflow = 'hidden';
    body.style.overflowX = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    // min-h-full이 레이아웃 뷰포트만큼 커져 키보드 아래 흰 여백이 생기는 것 방지
    body.style.minHeight = '0';

    return () => {
      const snapshot = snapshotRef.current;
      if (!snapshot) {
        return;
      }

      body.style.overflow = snapshot.bodyOverflow;
      body.style.overflowX = snapshot.bodyOverflowX;
      body.style.position = snapshot.bodyPosition;
      body.style.top = snapshot.bodyTop;
      body.style.left = snapshot.bodyLeft;
      body.style.right = snapshot.bodyRight;
      body.style.width = snapshot.bodyWidth;
      body.style.minHeight = snapshot.bodyMinHeight;
      html.style.overflow = snapshot.htmlOverflow;
      html.style.overscrollBehavior = snapshot.htmlOverscrollBehavior;
      snapshotRef.current = null;

      window.scrollTo(0, snapshot.scrollY);
    };
  }, [enabled]);
};
