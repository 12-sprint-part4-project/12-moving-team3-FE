/**
 * `/chat/[roomId]` 방 상세에서 반복 사용되는 클래스.
 */

/** 방 본문 래퍼 — globals.css @utility chat-room-content */
export const CHAT_ROOM_CONTENT_CLASS = 'chat-room-content';

/** 모바일 viewport lock 시 main 남은 높이 */
export const CHAT_ROOM_HEIGHT_MOBILE_LOCK_CLASS =
  'h-full max-h-full min-h-0 flex-1';

/** GNB 제외 뷰포트 높이 (모바일·태블릿) */
export const CHAT_ROOM_HEIGHT_DEFAULT_CLASS =
  'h-[calc(100dvh-var(--height-gnb))] max-h-[calc(100dvh-var(--height-gnb))]';

/** GNB 제외 뷰포트 높이 (데스크톱) */
export const CHAT_ROOM_HEIGHT_DESKTOP_CLASS =
  'lg:h-[calc(100dvh-var(--height-gnb-lg))] lg:max-h-[calc(100dvh-var(--height-gnb-lg))]';

/** 상단 헤더 — 뒤로가기·상대·메뉴 */
export const CHAT_ROOM_HEADER_CLASS =
  'relative flex w-full shrink-0 items-center justify-between border-b border-line-100 bg-white px-4 py-3 md:px-6';
