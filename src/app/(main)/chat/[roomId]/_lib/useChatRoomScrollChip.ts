'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { ChatMessage } from '@/types/chat';

type ScrollChipMode = 'hidden' | 'to-bottom' | 'new-message';

interface UseChatRoomScrollChipParams {
  roomId: number;
  enabled: boolean;
  messages: ChatMessage[];
  currentUserId: string | undefined;
}

/** 채팅방 하단 정렬·새 메시지 칩·전송 후 포커스 시그널 */
export const useChatRoomScrollChip = ({
  roomId,
  enabled,
  messages,
  currentUserId,
}: UseChatRoomScrollChipParams) => {
  const lastPartnerMessageIdRef = useRef<number | null>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showNewMessageChip, setShowNewMessageChip] = useState(false);
  const [trackedRoomId, setTrackedRoomId] = useState(roomId);
  const [scrollToBottomSignal, setScrollToBottomSignal] = useState(0);
  const [focusInputSignal, setFocusInputSignal] = useState(0);
  const isNearBottomRef = useRef(true);

  if (trackedRoomId !== roomId) {
    setTrackedRoomId(roomId);
    setIsNearBottom(true);
    setShowNewMessageChip(false);
  }

  useEffect(() => {
    lastPartnerMessageIdRef.current = null;
    isNearBottomRef.current = true;
  }, [roomId]);

  // 상대 새 메시지 — 하단이면 커서만 갱신, 위로 스크롤 중이면 안내 칩
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const latest = messages.at(-1);
    if (!latest || latest.senderId === currentUserId) {
      return;
    }

    const latestId = latest.messageId;
    if (isNearBottom) {
      lastPartnerMessageIdRef.current = latestId;
      return;
    }

    if (lastPartnerMessageIdRef.current === latestId) {
      return;
    }

    lastPartnerMessageIdRef.current = latestId;
    setShowNewMessageChip(true);
  }, [enabled, messages, currentUserId, isNearBottom]);

  const handleNearBottomChange = useCallback((nearBottom: boolean) => {
    isNearBottomRef.current = nearBottom;
    setIsNearBottom(nearBottom);
    if (nearBottom) {
      setShowNewMessageChip(false);
    }
  }, []);

  const handleScrollToBottom = useCallback(() => {
    setScrollToBottomSignal((current) => current + 1);
    setShowNewMessageChip(false);
  }, []);

  const handleComposerHeightChange = useCallback(() => {
    if (isNearBottomRef.current) {
      handleScrollToBottom();
    }
  }, [handleScrollToBottom]);

  const notifyMessageSent = useCallback(() => {
    handleScrollToBottom();
    setFocusInputSignal((current) => current + 1);
  }, [handleScrollToBottom]);

  const scrollChipMode: ScrollChipMode =
    !isNearBottom && showNewMessageChip
      ? 'new-message'
      : !isNearBottom
        ? 'to-bottom'
        : 'hidden';

  return {
    isNearBottom,
    scrollChipMode,
    scrollToBottomSignal,
    focusInputSignal,
    handleNearBottomChange,
    handleScrollToBottom,
    handleComposerHeightChange,
    notifyMessageSent,
  };
};
