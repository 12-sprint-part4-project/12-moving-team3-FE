import type { ChatLastMessage, ChatRoomListItem } from '@/types/chat';

interface ChatRoomActivitySortItem {
  roomId: number;
  lastActivityAt: string;
}

interface ChatRoomGnbPreviewSortItem extends ChatRoomActivitySortItem {
  unreadCount: number;
}

/** lastActivityAt ISO 내림차순, 동률 시 roomId 내림차순 */
export const compareChatRoomsByLastActivityDesc = (
  a: ChatRoomActivitySortItem,
  b: ChatRoomActivitySortItem
): number => {
  const byActivity = b.lastActivityAt.localeCompare(a.lastActivityAt);
  if (byActivity !== 0) {
    return byActivity;
  }

  return b.roomId - a.roomId;
};

/** GNB 미리보기: unread 우선 → lastActivityAt 내림차순 */
export const compareChatRoomsForGnbPreviewDesc = (
  a: ChatRoomGnbPreviewSortItem,
  b: ChatRoomGnbPreviewSortItem
): number => {
  const aHasUnread = a.unreadCount > 0;
  const bHasUnread = b.unreadCount > 0;

  if (aHasUnread !== bHasUnread) {
    return aHasUnread ? -1 : 1;
  }

  return compareChatRoomsByLastActivityDesc(a, b);
};

/** 채팅방 전체 목록 — BE lastActivityAt 정렬과 동일한 캐시 순서 */
export const sortChatRoomsByLastActivity = <T extends ChatRoomActivitySortItem>(
  rooms: T[]
): T[] => [...rooms].sort(compareChatRoomsByLastActivityDesc);

/** GNB 드롭다운 — unread 우선 후 lastActivityAt 정렬 */
export const sortChatRoomsForGnbPreview = <
  T extends ChatRoomGnbPreviewSortItem,
>(
  rooms: T[]
): T[] => [...rooms].sort(compareChatRoomsForGnbPreviewDesc);

const compareLastMessageRecency = (
  a: ChatLastMessage,
  b: ChatLastMessage
): number => {
  const byTime = a.createdAt.localeCompare(b.createdAt);
  if (byTime !== 0) {
    return byTime;
  }

  return a.messageId - b.messageId;
};

/** incoming이 current보다 최신(동시각이면 messageId 큼)이면 true */
const isIncomingLastMessageNewer = (
  incoming: ChatLastMessage,
  current: ChatLastMessage
): boolean => compareLastMessageRecency(incoming, current) > 0;

const shouldApplyIncomingLastMessage = (
  room: ChatRoomListItem,
  incoming: ChatLastMessage
): boolean => {
  if (room.lastMessage) {
    return isIncomingLastMessageNewer(incoming, room.lastMessage);
  }

  // lastMessage 없음: BE lastActivityAt(생성·재참여)보다 오래된 메시지는 무시
  return incoming.createdAt.localeCompare(room.lastActivityAt) >= 0;
};

/** lastMessage 반영 시 lastActivityAt 갱신 (역순·중복 도착 시 기존 최신 상태 유지) */
export const patchChatRoomWithLastMessage = (
  room: ChatRoomListItem,
  lastMessage: ChatLastMessage
): ChatRoomListItem => {
  if (!shouldApplyIncomingLastMessage(room, lastMessage)) {
    return room;
  }

  const lastActivityAt =
    lastMessage.createdAt.localeCompare(room.lastActivityAt) > 0
      ? lastMessage.createdAt
      : room.lastActivityAt;

  return {
    ...room,
    lastMessage,
    lastActivityAt,
  };
};

/** 목록 캐시: 방 lastMessage·lastActivityAt 갱신 후 lastActivityAt 순 재정렬 */
export const applyLastMessageToChatRoomsList = (
  rooms: ChatRoomListItem[],
  roomId: number,
  lastMessage: ChatLastMessage
): ChatRoomListItem[] => {
  const updated = rooms.map((room) =>
    room.roomId === roomId
      ? patchChatRoomWithLastMessage(room, lastMessage)
      : room
  );

  return sortChatRoomsByLastActivity(updated);
};
