import { io, type Socket } from 'socket.io-client';

import {
  CHAT_SOCKET_CLIENT_EVENTS,
  CHAT_SOCKET_SERVER_EVENTS,
} from '@/constants/chatSocket';
import { API_BASE_URL } from '@/lib/apiClient';
import { getAuthSession } from '@/lib/authSession';

import type {
  ChatJoinPayload,
  ChatLeavePayload,
  ChatSocketErrorPayload,
  ChatSocketMessagePayload,
  ChatSocketPartnerLeftPayload,
  ChatSocketReadPayload,
  ChatSocketUnreadPayload,
} from '@/types/chat';

/** Client → Server / Server → Client 이벤트 맵 (BE socket.types 미러) */
interface ChatClientToServerEvents {
  [CHAT_SOCKET_CLIENT_EVENTS.JOIN]: (
    payload: ChatJoinPayload,
    ack?: (response: { ok: boolean }) => void
  ) => void;
  [CHAT_SOCKET_CLIENT_EVENTS.LEAVE]: (
    payload: ChatLeavePayload,
    ack?: (response: { ok: boolean }) => void
  ) => void;
}

interface ChatServerToClientEvents {
  [CHAT_SOCKET_SERVER_EVENTS.MESSAGE]: (
    payload: ChatSocketMessagePayload
  ) => void;
  [CHAT_SOCKET_SERVER_EVENTS.READ]: (payload: ChatSocketReadPayload) => void;
  [CHAT_SOCKET_SERVER_EVENTS.UNREAD]: (
    payload: ChatSocketUnreadPayload
  ) => void;
  [CHAT_SOCKET_SERVER_EVENTS.PARTNER_LEFT]: (
    payload: ChatSocketPartnerLeftPayload
  ) => void;
  [CHAT_SOCKET_SERVER_EVENTS.ERROR]: (payload: ChatSocketErrorPayload) => void;
}

/** socket.io-client: ListenEvents(서버→클라) , EmitEvents(클라→서버) */
export type ChatSocket = Socket<
  ChatServerToClientEvents,
  ChatClientToServerEvents
>;

let socket: ChatSocket | null = null;

const connectionListeners = new Set<() => void>();

const notifyConnectionListeners = (): void => {
  connectionListeners.forEach((listener) => listener());
};

const resolveAccessToken = (): string | null =>
  getAuthSession()?.accessToken?.trim() || null;

const bindConnectionLifecycle = (instance: ChatSocket): void => {
  instance.on('connect', notifyConnectionListeners);
  instance.on('disconnect', notifyConnectionListeners);
};

/**
 * 채팅 Socket.IO 싱글톤.
 * 컴포넌트에서 `io()`를 직접 호출하지 않고 이 모듈만 사용한다.
 */
export const getChatSocket = (): ChatSocket | null => socket;

/** useSyncExternalStore용 — 소켓 연결 상태 구독 */
export const subscribeChatSocketConnection = (
  onStoreChange: () => void
): (() => void) => {
  connectionListeners.add(onStoreChange);
  return () => {
    connectionListeners.delete(onStoreChange);
  };
};

export const getChatSocketConnectedSnapshot = (): boolean =>
  Boolean(socket?.connected);

export const getChatSocketConnectedServerSnapshot = (): boolean => false;

/** 로그인 세션이 있을 때만 연결한다. 이미 연결·연결 중이면 재사용한다. */
export const connectChatSocket = (): ChatSocket | null => {
  if (!resolveAccessToken()) {
    return null;
  }

  if (socket) {
    if (!socket.connected) {
      socket.connect();
    }
    return socket;
  }

  // 재연결마다 최신 accessToken을 handshake auth에 실어 보낸다.
  // API_BASE_URL은 REST가 `/api`를 붙이므로 origin만 사용한다.
  // socket.io-client@4.8.3의 io()는 이벤트 맵 제네릭을 받지 않아 단언이 필요하다.
  socket = io(API_BASE_URL, {
    autoConnect: false,
    withCredentials: true,
    auth: (cb: (data: { token: string }) => void) => {
      cb({ token: resolveAccessToken() ?? '' });
    },
    transports: ['websocket', 'polling'],
  }) as ChatSocket;

  bindConnectionLifecycle(socket);
  socket.connect();
  notifyConnectionListeners();
  return socket;
};

/** 로그아웃·언마운트 시 연결을 끊고 싱글톤을 비운다. */
export const disconnectChatSocket = (): void => {
  if (!socket) {
    return;
  }

  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
  notifyConnectionListeners();
};

export const emitChatJoin = (roomId: number): void => {
  socket?.emit(CHAT_SOCKET_CLIENT_EVENTS.JOIN, { roomId });
};

export const emitChatLeave = (roomId: number): void => {
  socket?.emit(CHAT_SOCKET_CLIENT_EVENTS.LEAVE, { roomId });
};
