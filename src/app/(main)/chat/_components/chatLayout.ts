/**
 * `/chat` 목록·공통 안내에서 반복 사용되는 클래스.
 * `chat-content` / `chat-room-content`는 globals.css @utility.
 */

/** 목록·로그인·invalid room 안내 래퍼 */
export const CHAT_CONTENT_CLASS = 'chat-content';

/** 페이지 제목 「채팅」 */
export const CHAT_PAGE_TITLE_CLASS = 'text-2xl-bold text-black-400';

/** 목록 카드 컨테이너 */
export const CHAT_LIST_PANEL_CLASS =
  'mt-6 flex flex-col overflow-hidden rounded-3xl border border-line-200 bg-white';

/** 목록 로딩·에러·빈 상태 메시지 */
export const CHAT_LIST_STATE_MESSAGE_CLASS =
  'px-6 py-10 text-center text-md-medium text-gray-300';
