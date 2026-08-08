/** 채팅 메시지 신고 안내 — 전체 채팅 기능 최초 1회 (방 단위 아님) */
export const CHAT_MESSAGE_REPORT_HINT_STORAGE_KEY =
  'chat.messageReportHint.seen';

/** ⋮ 호버 숨김과 동일: md + fine pointer + hover 가능 */
export const CHAT_MESSAGE_REPORT_HINT_HOVER_MQ =
  '(min-width: 768px) and (hover: hover) and (pointer: fine)';

export const CHAT_MESSAGE_REPORT_HINT_MESSAGE_HOVER =
  '상대 메시지에 마우스를 올리면 신고할 수 있어요';

export const CHAT_MESSAGE_REPORT_HINT_MESSAGE_TOUCH =
  '상대 메시지의 더보기 메뉴에서 신고할 수 있어요';

/** 다른 토스트와 겹침을 줄이기 위한 메시지 로드 후 지연 */
export const CHAT_MESSAGE_REPORT_HINT_DELAY_MS = 800;

/**
 * 현재 포인터·뷰포트에 맞는 신고 안내 문구.
 * ChatMessageMenu 노출 조건(md + hover/fine)과 맞춘다.
 */
export const getChatMessageReportHintMessage = (): string => {
  if (typeof window === 'undefined') {
    return CHAT_MESSAGE_REPORT_HINT_MESSAGE_TOUCH;
  }

  try {
    if (window.matchMedia(CHAT_MESSAGE_REPORT_HINT_HOVER_MQ).matches) {
      return CHAT_MESSAGE_REPORT_HINT_MESSAGE_HOVER;
    }
  } catch {
    // matchMedia 불가 시 터치/상시 노출 문구
  }

  return CHAT_MESSAGE_REPORT_HINT_MESSAGE_TOUCH;
};
