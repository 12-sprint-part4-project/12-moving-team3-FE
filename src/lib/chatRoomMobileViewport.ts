/**
 * 모바일 채팅방 — visualViewport 가시 영역에 body를 맞춘다 (#279).
 * 키보드가 열리면 height/offsetTop이 줄·이동하고, 채팅 UI가 같이 축소된다.
 * 메시지 목록 스크롤은 body가 아니라 리스트 overflow로 유지한다.
 */

export const VISUAL_VIEWPORT_HEIGHT_VAR = '--visual-viewport-height';
export const CHAT_ROOM_VIEWPORT_LOCK_CLASS = 'chat-room-viewport-lock';

export interface VisualViewportBox {
  height: number;
  offsetTop: number;
}

export interface ChatRoomViewportElements {
  html: HTMLElement;
  body: HTMLElement;
}

/** visualViewport(또는 폴백) 박스를 DOM에 반영 */
export const applyChatRoomMobileViewportBox = (
  box: VisualViewportBox,
  { html, body }: ChatRoomViewportElements
): void => {
  html.style.setProperty(VISUAL_VIEWPORT_HEIGHT_VAR, `${box.height}px`);

  body.style.position = 'fixed';
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
  body.style.overflow = 'hidden';
  body.style.overflowX = 'hidden';
  body.style.top = `${box.offsetTop}px`;
  body.style.height = `${box.height}px`;
  body.style.maxHeight = `${box.height}px`;
  body.style.minHeight = `${box.height}px`;

  html.style.overflow = 'hidden';
  html.style.overscrollBehavior = 'none';
};

export const readVisualViewportBox = (): VisualViewportBox => {
  const vv = window.visualViewport;
  return {
    height: vv?.height ?? window.innerHeight,
    offsetTop: vv?.offsetTop ?? 0,
  };
};
