'use client';

import { useEffect } from 'react';

import { useChatSocket } from '@/providers/ChatSocketProvider';

const isValidRoomId = (roomId: number): boolean =>
  Number.isInteger(roomId) && roomId > 0;

/**
 * 채팅방 화면 진입 시 `chat:join`, 퇴장/언마운트 시 `chat:leave`를 emit한다.
 * REST `/read`는 방 상세 화면에서 별도로 호출한다.
 */
export const useChatSocketRoom = (roomId: number): void => {
  const { joinRoom, leaveRoom, isConnected } = useChatSocket();

  useEffect(() => {
    if (!isConnected || !isValidRoomId(roomId)) {
      return;
    }

    joinRoom(roomId);

    return () => {
      leaveRoom(roomId);
    };
  }, [roomId, isConnected, joinRoom, leaveRoom]);
};
