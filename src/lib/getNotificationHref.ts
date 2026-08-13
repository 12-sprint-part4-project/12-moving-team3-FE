import { parsePositiveInt } from '@/lib/parsePositiveInt';
import type {
  NotificationItem,
  NotificationRole,
} from '@/types/notification';

/**
 * 알림 클릭 시 이동 경로.
 * type별 딥링크 → quoteId → estimateRequestId 순.
 */
export const getNotificationHref = (
  item: NotificationItem,
  role: NotificationRole
): string | null => {
  switch (item.type) {
    case 'COMMUNITY_COMMENT':
    case 'COMMUNITY_REPLY': {
      const postId = parsePositiveInt(item.payload.postId);
      return postId != null ? `/community/${postId}` : '/community';
    }
    case 'CHAT_ROOM_OPENED': {
      const roomId = parsePositiveInt(item.payload.chatRoomId);
      return roomId != null ? `/chat/${roomId}` : '/chat';
    }
    case 'POST_REMOVED_BY_REPORT':
      // 게시글은 이미 삭제됨 — 목록으로
      return '/community';
    case 'SANCTION_NOTIFIED':
      return null;
    case 'REVIEW_REQUESTED':
      return role === 'customer' ? '/reviews' : null;
    case 'REVIEW_WRITTEN':
      return role === 'mover' ? '/mover/mypage' : null;
    default:
      break;
  }

  if (item.quoteId != null) {
    return role === 'mover'
      ? `/mover/quotes/${item.quoteId}`
      : `/quotes/${item.quoteId}`;
  }

  if (item.estimateRequestId != null) {
    // 기사: 받은 요청 목록 + focus(스크롤 딥링크용). 고객: 견적 목록
    return role === 'mover'
      ? `/mover/requests?focus=${item.estimateRequestId}`
      : '/quotes';
  }

  return null;
};
