import { describe, expect, it, vi } from 'vitest';

import { API_ERROR_CODE } from '@/constants/errorCode';
import { ApiError } from '@/lib/apiClient';
import { parseEventBlock } from '@/lib/notificationSseClient';

const createHandlers = () => ({
  onNotification: vi.fn(),
  onUnreadCount: vi.fn(),
  onNotificationRefresh: vi.fn(),
  onError: vi.fn(),
});

describe('parseEventBlock — notification-refresh', () => {
  it('유효한 data: {} 이면 onNotificationRefresh만 한 번 호출한다', () => {
    const handlers = createHandlers();

    parseEventBlock('event: notification-refresh\ndata: {}', handlers);

    expect(handlers.onNotificationRefresh).toHaveBeenCalledTimes(1);
    expect(handlers.onError).not.toHaveBeenCalled();
    expect(handlers.onNotification).not.toHaveBeenCalled();
    expect(handlers.onUnreadCount).not.toHaveBeenCalled();
  });

  it('JSON 파싱 실패 시 onError만 호출하고 refresh는 호출하지 않는다', () => {
    const handlers = createHandlers();

    parseEventBlock('event: notification-refresh\ndata: {', handlers);

    expect(handlers.onError).toHaveBeenCalledTimes(1);
    expect(handlers.onError.mock.calls[0]?.[0]).toBeInstanceOf(ApiError);
    expect(handlers.onError.mock.calls[0]?.[0]).toMatchObject({
      code: API_ERROR_CODE.INVALID_SSE_EVENT,
    });
    expect(handlers.onNotificationRefresh).not.toHaveBeenCalled();
  });

  it('추가 필드가 있으면 스키마 실패로 onError만 호출한다', () => {
    const handlers = createHandlers();

    parseEventBlock(
      'event: notification-refresh\ndata: {"unexpected":true}',
      handlers
    );

    expect(handlers.onError).toHaveBeenCalledTimes(1);
    expect(handlers.onError.mock.calls[0]?.[0]).toMatchObject({
      code: API_ERROR_CODE.INVALID_SSE_EVENT,
    });
    expect(handlers.onNotificationRefresh).not.toHaveBeenCalled();
  });

  it('스키마와 무관하게 잘못된 타입 payload도 onError만 호출한다', () => {
    const handlers = createHandlers();

    parseEventBlock('event: notification-refresh\ndata: []', handlers);

    expect(handlers.onError).toHaveBeenCalledTimes(1);
    expect(handlers.onNotificationRefresh).not.toHaveBeenCalled();
  });
});
