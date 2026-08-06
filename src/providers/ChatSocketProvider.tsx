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
 * SUSPENDED는 Socket.IO가 거부되므로 연결하지 않는다.
 *
 * `chat:read`는 현재 FE 캐시에 읽음 커서가 없어 구독하지 않는다.
 * 읽음 UI가 추가되면 핸들러를 등록한다.
 */
export const ChatSocketProvider = ({ children }: ChatSocketProviderProps) => {
  const { user, isReady } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const userId = user?.id ?? null;

  const queryClientRef = useRef(queryClient);
  const showToastRef = useRef(showToast);

  useEffect(() => {
    queryClientRef.current = queryClient;
    showToastRef.current = showToast;
  }, [queryClient, showToast]);

  const isConnected = useSyncExternalStore(
    subscribeChatSocketConnection,
    getChatSocketConnectedSnapshot,
    getChatSocketConnectedServerSnapshot
  );

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!userId || user?.status === 'SUSPENDED') {
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

    const handleUnread = (payload: ChatSocketUnreadPayload) => {
      applySocketUnreadToCaches(queryClientRef.current, payload);
    };

    const handleError = (payload: ChatSocketErrorPayload) => {
      showToastRef.current({
        content: payload.message || '채팅 연결 오류가 발생했습니다.',
      });
    };

    socket.on(CHAT_SOCKET_SERVER_EVENTS.MESSAGE, handleMessage);
    socket.on(CHAT_SOCKET_SERVER_EVENTS.UNREAD, handleUnread);
    socket.on(CHAT_SOCKET_SERVER_EVENTS.ERROR, handleError);

    return () => {
      socket.off(CHAT_SOCKET_SERVER_EVENTS.MESSAGE, handleMessage);
      socket.off(CHAT_SOCKET_SERVER_EVENTS.UNREAD, handleUnread);
      socket.off(CHAT_SOCKET_SERVER_EVENTS.ERROR, handleError);
      disconnectChatSocket();
    };
  }, [isReady, userId, user?.status]);

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
