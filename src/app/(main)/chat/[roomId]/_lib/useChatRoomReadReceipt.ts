'use client';

import { useEffect, useRef } from 'react';

import { useMarkChatRoomAsRead } from '@/hooks/useChat';

import type { ChatMessage } from '@/types/chat';

interface UseChatRoomReadReceiptParams {
  roomId: number;
  enabled: boolean;
  messages: ChatMessage[];
  currentUserId: string | undefined;
  isNearBottom: boolean;
}

/** 하단 근처일 때 상대 최신 메시지를 읽음 처리 */
export const useChatRoomReadReceipt = ({
  roomId,
  enabled,
  messages,
  currentUserId,
  isNearBottom,
}: UseChatRoomReadReceiptParams) => {
  const { mutate: markAsRead } = useMarkChatRoomAsRead(roomId);
  const lastMarkedMessageIdRef = useRef<number | null>(null);

  useEffect(() => {
    lastMarkedMessageIdRef.current = null;
  }, [roomId]);

  useEffect(() => {
    if (!enabled) {
      lastMarkedMessageIdRef.current = null;
      return;
    }

    if (!isNearBottom) {
      return;
    }

    const latest = messages.at(-1);
    if (!latest || latest.senderId === currentUserId) {
      return;
    }

    const latestMessageId = latest.messageId;
    if (lastMarkedMessageIdRef.current === latestMessageId) {
      return;
    }

    lastMarkedMessageIdRef.current = latestMessageId;
    markAsRead(
      { lastReadMessageId: latestMessageId },
      {
        onError: () => {
          if (lastMarkedMessageIdRef.current === latestMessageId) {
            lastMarkedMessageIdRef.current = null;
          }
        },
      }
    );
  }, [enabled, roomId, messages, markAsRead, currentUserId, isNearBottom]);
};
