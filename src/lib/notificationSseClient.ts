import {
  API_BASE_URL,
  ApiError,
  DEFAULT_API_ERROR_MESSAGE,
  getAccessToken,
  throwApiError,
  toNetworkApiError,
} from '@/lib/apiClient';
import { refreshAccessToken } from '@/lib/authRefresh';
import {
  notificationItemSchema,
  notificationSseUnreadCountSchema,
} from '@/lib/notificationSchema';
import type { NotificationItem } from '@/types/notification';

const NOTIFICATION_EVENT = 'notification';
const UNREAD_COUNT_EVENT = 'unread-count';
const SSE_RECONNECT_BASE_DELAY_MS = 1_000;
const SSE_RECONNECT_MAX_DELAY_MS = 15_000;

interface NotificationStreamHandlers {
  onNotification: (notification: NotificationItem) => void;
  onUnreadCount: (unreadCount: number) => void;
  onError?: (error: ApiError) => void;
}

interface ActiveConnection {
  id: symbol;
  controller: AbortController;
}

let activeConnection: ActiveConnection | null = null;

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const waitForReconnect = (
  delayMs: number,
  signal: AbortSignal
): Promise<void> =>
  new Promise((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }

    const handleAbort = () => {
      clearTimeout(timeoutId);
      resolve();
    };

    // 정상 대기 완료 시 abort 리스너도 제거해 재연결마다 누적되지 않게 한다.
    const timeoutId = setTimeout(() => {
      signal.removeEventListener('abort', handleAbort);
      resolve();
    }, delayMs);

    signal.addEventListener('abort', handleAbort, { once: true });
  });

const fetchStream = async (
  signal: AbortSignal,
  accessToken: string | null
): Promise<Response> =>
  fetch(`${API_BASE_URL}/api/notifications/stream`, {
    method: 'GET',
    credentials: 'include',
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined,
    signal,
  });

/**
 * SSE 연결은 장시간 유지되므로 일반 authFetch의 10초 타임아웃을 사용하지 않는다.
 * 첫 401에 한해서 Access Token을 갱신한 뒤 새 스트림으로 한 번 재시도한다.
 */
const openStream = async (signal: AbortSignal): Promise<Response> => {
  let response = await fetchStream(signal, getAccessToken());

  if (response.status === 401) {
    const refreshedAccessToken = await refreshAccessToken();
    response = await fetchStream(signal, refreshedAccessToken);
  }

  if (!response.ok) {
    return throwApiError(response);
  }

  return response;
};

const parseEventBlock = (
  block: string,
  handlers: NotificationStreamHandlers
): void => {
  const lines = block.split(/\r?\n/);
  const eventName = lines
    .find((line) => line.startsWith('event:'))
    ?.slice('event:'.length)
    .trim();
  const data = lines
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice('data:'.length).trimStart())
    .join('\n');

  // connected/heartbeat 주석과 data 없는 이벤트는 처리하지 않는다.
  if (!eventName || !data) {
    return;
  }

  let payload: unknown;
  try {
    payload = JSON.parse(data);
  } catch {
    handlers.onError?.(
      new ApiError(500, DEFAULT_API_ERROR_MESSAGE, 'INVALID_SSE_EVENT')
    );
    return;
  }

  if (eventName === NOTIFICATION_EVENT) {
    const parsed = notificationItemSchema.safeParse(payload);
    if (!parsed.success) {
      handlers.onError?.(
        new ApiError(500, DEFAULT_API_ERROR_MESSAGE, 'INVALID_SSE_EVENT')
      );
      return;
    }
    handlers.onNotification(parsed.data);
    return;
  }

  if (eventName === UNREAD_COUNT_EVENT) {
    const parsed = notificationSseUnreadCountSchema.safeParse(payload);
    if (!parsed.success) {
      handlers.onError?.(
        new ApiError(500, DEFAULT_API_ERROR_MESSAGE, 'INVALID_SSE_EVENT')
      );
      return;
    }
    handlers.onUnreadCount(parsed.data.unreadCount);
  }
};

/** 청크 경계와 CRLF를 고려해 빈 줄 단위의 SSE 이벤트를 순서대로 꺼낸다. */
const consumeStream = async (
  response: Response,
  signal: AbortSignal,
  handlers: NotificationStreamHandlers
): Promise<void> => {
  if (!response.body) {
    throw new ApiError(
      500,
      DEFAULT_API_ERROR_MESSAGE,
      'SSE_STREAM_UNAVAILABLE'
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (!signal.aborted) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });

      let separatorMatch = /\r?\n\r?\n/.exec(buffer);
      while (separatorMatch?.index != null) {
        const block = buffer.slice(0, separatorMatch.index);
        buffer = buffer.slice(separatorMatch.index + separatorMatch[0].length);
        parseEventBlock(block, handlers);
        separatorMatch = /\r?\n\r?\n/.exec(buffer);
      }

      if (done) {
        // 구분자 없이 스트림이 끝나도 마지막 SSE 이벤트를 유실하지 않는다.
        if (buffer) {
          parseEventBlock(buffer, handlers);
        }
        return;
      }
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }
};

const runConnectionLoop = async (
  connection: ActiveConnection,
  handlers: NotificationStreamHandlers
): Promise<void> => {
  const { signal } = connection.controller;
  let reconnectDelayMs = SSE_RECONNECT_BASE_DELAY_MS;

  try {
    while (!signal.aborted) {
      try {
        const response = await openStream(signal);
        reconnectDelayMs = SSE_RECONNECT_BASE_DELAY_MS;
        await consumeStream(response, signal, handlers);
      } catch (error) {
        if (signal.aborted || isAbortError(error)) {
          return;
        }

        const apiError =
          error instanceof ApiError ? error : toNetworkApiError(error);
        handlers.onError?.(apiError);

        // 토큰 갱신 후에도 인증이 실패하면 자동 재연결을 중단한다.
        if (apiError.status === 401) {
          return;
        }
      }

      await waitForReconnect(reconnectDelayMs, signal);
      reconnectDelayMs = Math.min(
        reconnectDelayMs * 2,
        SSE_RECONNECT_MAX_DELAY_MS
      );
    }
  } finally {
    if (activeConnection?.id === connection.id) {
      activeConnection = null;
    }
  }
};

/** 로그인 세션당 하나의 알림 스트림만 유지하고 호출자별 안전한 cleanup을 반환한다. */
export const connectNotificationStream = (
  handlers: NotificationStreamHandlers
): (() => void) => {
  activeConnection?.controller.abort();

  const connection: ActiveConnection = {
    id: Symbol('notification-sse-connection'),
    controller: new AbortController(),
  };
  activeConnection = connection;
  void runConnectionLoop(connection, handlers);

  return () => {
    if (activeConnection?.id === connection.id) {
      activeConnection.controller.abort();
      activeConnection = null;
    }
  };
};

/** 로그아웃처럼 호출자 cleanup과 무관하게 현재 스트림을 즉시 종료할 때 사용한다. */
export const disconnectNotificationStream = (): void => {
  activeConnection?.controller.abort();
  activeConnection = null;
};
