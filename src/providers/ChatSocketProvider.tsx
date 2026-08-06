'use client';

import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

import { CHAT_SOCKET_SERVER_EVENTS } from '@/constants/chatSocket';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import {
  applySocketMessageToCaches,
  applySocketReadToCaches,
  applySocketUnreadToCaches,
} from '@/lib/chatSocketCache';
import {
  connectChatSocket,
  disconnectChatSocket,
  emitChatJoin,
  emitChatLeave,
  getChatSocket,
  getChatSocketConnectedServerSnapshot,
  getChatSocketConnectedSnapshot,
  subscribeChatSocketConnection,
} from '@/lib/chatSocketClient';
import type {
  ChatSocketErrorPayload,
  ChatSocketMessagePayload,
  ChatSocketReadPayload,
  ChatSocketUnreadPayload,
} from '@/types/chat';

interface ChatSocketContextValue {
  isConnected: boolean;
  joinRoom: (roomId: number) => void;
  leaveRoom: (roomId: number) => void;
}

const ChatSocketContext = createContext<ChatSocketContextValue | null>(null);

interface ChatSocketProviderProps {
  children: ReactNode;
}

/**
 * 로그인 세션이 있을 때 채팅 소켓을 연결하고,
 * 서버 이벤트를 TanStack Query 캐시에 반영한다.
 * 전송·읽음·나가기는 REST 훅을 유지한다.
 */
export const ChatSocketProvider = ({ children }: ChatSocketProviderProps) => {
  const { user, isReady } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const userId = user?.id ?? null;

  const queryClientRef = useRef(queryClient);
  const showToastRef = useRef(showToast);
  const userIdRef = useRef(userId);

  useEffect(() => {
    queryClientRef.current = queryClient;
    showToastRef.current = showToast;
    userIdRef.current = userId;
  }, [queryClient, showToast, userId]);

  const isConnected = useSyncExternalStore(
    subscribeChatSocketConnection,
    getChatSocketConnectedSnapshot,
    getChatSocketConnectedServerSnapshot
  );

  // 연결 수명은 userId 기준으로만 관리한다.
  // queryClient/showToast가 바뀌어도 소켓을 끊지 않아 실시간 수신이 끊기지 않게 한다.
  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!userId) {
      disconnectChatSocket();
      return;
    }

    const socket = connectChatSocket();
    if (!socket) {
      return;
    }

    const handleMessage = (payload: ChatSocketMessagePayload) => {
      applySocketMessageToCaches(queryClientRef.current, payload);
    };

    const handleRead = (payload: ChatSocketReadPayload) => {
      const currentUserId = userIdRef.current;
      if (!currentUserId) {
        return;
      }
      applySocketReadToCaches(queryClientRef.current, payload, currentUserId);
    };

    const handleUnread = (payload: ChatSocketUnreadPayload) => {
      applySocketUnreadToCaches(queryClientRef.current, payload);
    };

    const handleError = (payload: ChatSocketErrorPayload) => {
      showToastRef.current({
        content: payload.message || '채팅 연결 오류가 발생했습니다.',
      });
    };

    socket.on(CHAT_SOCKET_SERVER_EVENTS.MESSAGE, handleMessage);
    socket.on(CHAT_SOCKET_SERVER_EVENTS.READ, handleRead);
    socket.on(CHAT_SOCKET_SERVER_EVENTS.UNREAD, handleUnread);
    socket.on(CHAT_SOCKET_SERVER_EVENTS.ERROR, handleError);

    return () => {
      socket.off(CHAT_SOCKET_SERVER_EVENTS.MESSAGE, handleMessage);
      socket.off(CHAT_SOCKET_SERVER_EVENTS.READ, handleRead);
      socket.off(CHAT_SOCKET_SERVER_EVENTS.UNREAD, handleUnread);
      socket.off(CHAT_SOCKET_SERVER_EVENTS.ERROR, handleError);
      disconnectChatSocket();
    };
  }, [isReady, userId]);

  const joinRoom = useCallback((roomId: number) => {
    if (!getChatSocket()?.connected) {
      return;
    }
    emitChatJoin(roomId);
  }, []);

  const leaveRoom = useCallback((roomId: number) => {
    if (!getChatSocket()?.connected) {
      return;
    }
    emitChatLeave(roomId);
  }, []);

  const value = useMemo(
    () => ({ isConnected, joinRoom, leaveRoom }),
    [isConnected, joinRoom, leaveRoom]
  );

  return (
    <ChatSocketContext.Provider value={value}>
      {children}
    </ChatSocketContext.Provider>
  );
};

export const useChatSocket = (): ChatSocketContextValue => {
  const context = useContext(ChatSocketContext);

  if (!context) {
    throw new Error(
      'useChatSocket는 ChatSocketProvider 내부에서만 사용할 수 있습니다.'
    );
  }

  return context;
};
