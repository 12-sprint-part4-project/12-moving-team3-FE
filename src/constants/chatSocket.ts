/** 클라이언트 → 서버 이벤트 (BE chat-socket.constants 미러) */
export const CHAT_SOCKET_CLIENT_EVENTS = {
  JOIN: 'chat:join',
  LEAVE: 'chat:leave',
} as const;

/** 서버 → 클라이언트 이벤트 (BE chat-socket.constants 미러) */
export const CHAT_SOCKET_SERVER_EVENTS = {
  MESSAGE: 'chat:message',
  READ: 'chat:read',
  UNREAD: 'chat:unread',
  ERROR: 'chat:error',
} as const;

export type ChatSocketClientEvent =
  (typeof CHAT_SOCKET_CLIENT_EVENTS)[keyof typeof CHAT_SOCKET_CLIENT_EVENTS];

export type ChatSocketServerEvent =
  (typeof CHAT_SOCKET_SERVER_EVENTS)[keyof typeof CHAT_SOCKET_SERVER_EVENTS];
