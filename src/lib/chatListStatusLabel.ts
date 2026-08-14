import {
  formatMyMessageSentLabel,
  formatPartnerReadReceiptLabel,
  formatRelativeTime,
} from '@/lib/formatDate';

import type { ChatRoomListItem } from '@/types/chat';

/** 목록·GNB 미리보기용 마지막 메시지 상태 라벨 */
export const getChatListStatusLabel = (
  room: ChatRoomListItem,
  currentUserId: string
): string => {
  const { lastMessage, partnerLastReadMessageId, partnerLastReadAt } = room;

  if (!lastMessage) {
    return '';
  }

  const isMine = lastMessage.senderId === currentUserId;

  if (!isMine) {
    return formatRelativeTime(lastMessage.createdAt);
  }

  const isReadByPartner =
    partnerLastReadMessageId != null &&
    lastMessage.messageId <= partnerLastReadMessageId;

  if (isReadByPartner) {
    return formatPartnerReadReceiptLabel(partnerLastReadAt);
  }

  return formatMyMessageSentLabel(lastMessage.createdAt);
};
