'use client';

import { useEffect, useRef } from 'react';

import {
  applyChatRoomMobileViewportBox,
  CHAT_ROOM_VIEWPORT_LOCK_CLASS,
  readVisualViewportBox,
  VISUAL_VIEWPORT_HEIGHT_VAR,
} from '@/lib/chatRoomMobileViewport';

interface StyleSnapshot {
  htmlOverflow: string;
  htmlOverscrollBehavior: string;
  bodyOverflow: string;
  bodyOverflowX: string;
  bodyPosition: string;
  bodyTop: string;
  bodyLeft: string;
  bodyRight: string;
  bodyWidth: string;
  bodyHeight: string;
  bodyMaxHeight: string;
  bodyMinHeight: string;
  scrollY: number;
}

/**
 * 모바일 채팅방: 문서 스크롤을 막고 body를 visualViewport에 고정한다.
 * 키보드 오픈 시 가시 영역이 줄면 body(채팅 UI)도 같이 줄어든다 (#279).
 * 데스크톱에서는 호출하지 않는다.
 */
export const useChatRoomMobileViewport = (enabled = true) => {
  const snapshotRef = useRef<StyleSnapshot | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const html = document.documentElement;
    const { body } = document;

    snapshotRef.current = {
      htmlOverflow: html.style.overflow,
      htmlOverscrollBehavior: html.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyOverflowX: body.style.overflowX,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyHeight: body.style.height,
      bodyMaxHeight: body.style.maxHeight,
      bodyMinHeight: body.style.minHeight,
      scrollY: window.scrollY,
    };

    html.classList.add(CHAT_ROOM_VIEWPORT_LOCK_CLASS);

    const sync = () => {
      applyChatRoomMobileViewportBox(readVisualViewportBox(), { html, body });
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    };

    sync();

    const vv = window.visualViewport;
    vv?.addEventListener('resize', sync);
    vv?.addEventListener('scroll', sync);
    window.addEventListener('resize', sync);

    // iOS가 입력 포커스로 visualViewport를 밀 때 즉시 재고정
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (
        !(target instanceof HTMLElement) ||
        (target.tagName !== 'INPUT' &&
          target.tagName !== 'TEXTAREA' &&
          !target.isContentEditable)
      ) {
        return;
      }

      requestAnimationFrame(() => {
        sync();
        requestAnimationFrame(sync);
      });
    };

    document.addEventListener('focusin', handleFocusIn);

    return () => {
      vv?.removeEventListener('resize', sync);
      vv?.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
      document.removeEventListener('focusin', handleFocusIn);

      const snapshot = snapshotRef.current;
      html.classList.remove(CHAT_ROOM_VIEWPORT_LOCK_CLASS);
      html.style.removeProperty(VISUAL_VIEWPORT_HEIGHT_VAR);

      if (snapshot) {
        html.style.overflow = snapshot.htmlOverflow;
        html.style.overscrollBehavior = snapshot.htmlOverscrollBehavior;
        body.style.overflow = snapshot.bodyOverflow;
        body.style.overflowX = snapshot.bodyOverflowX;
        body.style.position = snapshot.bodyPosition;
        body.style.top = snapshot.bodyTop;
        body.style.left = snapshot.bodyLeft;
        body.style.right = snapshot.bodyRight;
        body.style.width = snapshot.bodyWidth;
        body.style.height = snapshot.bodyHeight;
        body.style.maxHeight = snapshot.bodyMaxHeight;
        body.style.minHeight = snapshot.bodyMinHeight;
        window.scrollTo(0, snapshot.scrollY);
      }

      snapshotRef.current = null;
    };
  }, [enabled]);
};
