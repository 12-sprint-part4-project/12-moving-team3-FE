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

const validNotificationItem = {
  id: 1,
  type: 'REVIEW_WRITTEN',
  content: '리뷰가 등록되었어요.',
  payload: {},
  isRead: false,
  createdAt: '2026-08-26T00:00:00.000Z',
  quoteId: null,
  estimateRequestId: null,
  commentId: null,
  reviewId: 10,
  userReportId: null,
};

describe('parseEventBlock — notification', () => {
  it('유효한 알림이면 onNotification만 호출한다', () => {
    const handlers = createHandlers();

    parseEventBlock(
      `event: notification\ndata: ${JSON.stringify(validNotificationItem)}`,
      handlers
    );

    expect(handlers.onNotification).toHaveBeenCalledTimes(1);
    expect(handlers.onNotification).toHaveBeenCalledWith(validNotificationItem);
    expect(handlers.onError).not.toHaveBeenCalled();
  });

  it('스키마 검증에 실패하면 onError만 호출한다', () => {
    const handlers = createHandlers();
    const invalidItem = { ...validNotificationItem, type: undefined };

    parseEventBlock(
      `event: notification\ndata: ${JSON.stringify(invalidItem)}`,
      handlers
    );

    expect(handlers.onError).toHaveBeenCalledTimes(1);
    expect(handlers.onError.mock.calls[0]?.[0]).toMatchObject({
      code: API_ERROR_CODE.INVALID_SSE_EVENT,
    });
    expect(handlers.onNotification).not.toHaveBeenCalled();
  });
});

describe('parseEventBlock — unread-count', () => {
  it('유효한 unreadCount면 onUnreadCount를 호출한다', () => {
    const handlers = createHandlers();

    parseEventBlock('event: unread-count\ndata: {"unreadCount":5}', handlers);

    expect(handlers.onUnreadCount).toHaveBeenCalledTimes(1);
    expect(handlers.onUnreadCount).toHaveBeenCalledWith(5);
    expect(handlers.onError).not.toHaveBeenCalled();
  });

  it('음수 unreadCount는 스키마 검증 실패로 onError만 호출한다', () => {
    const handlers = createHandlers();

    parseEventBlock('event: unread-count\ndata: {"unreadCount":-1}', handlers);

    expect(handlers.onError).toHaveBeenCalledTimes(1);
    expect(handlers.onError.mock.calls[0]?.[0]).toMatchObject({
      code: API_ERROR_CODE.INVALID_SSE_EVENT,
    });
    expect(handlers.onUnreadCount).not.toHaveBeenCalled();
  });

  it('멀티라인 data: 는 줄바꿈으로 join된 뒤 하나의 JSON으로 파싱된다', () => {
    const handlers = createHandlers();

    parseEventBlock(
      'event: unread-count\ndata: {"unreadCount":\ndata: 5}',
      handlers
    );

    expect(handlers.onUnreadCount).toHaveBeenCalledWith(5);
    expect(handlers.onError).not.toHaveBeenCalled();
  });
});

describe('parseEventBlock — 기타', () => {
  it('알 수 없는 이벤트는 어떤 핸들러도 호출하지 않고 무시한다', () => {
    const handlers = createHandlers();

    parseEventBlock('event: unknown-event\ndata: {}', handlers);

    expect(handlers.onNotification).not.toHaveBeenCalled();
    expect(handlers.onUnreadCount).not.toHaveBeenCalled();
    expect(handlers.onNotificationRefresh).not.toHaveBeenCalled();
    expect(handlers.onError).not.toHaveBeenCalled();
  });

  it('data: 라인이 없으면 조기 return하고 어떤 핸들러도 호출하지 않는다', () => {
    const handlers = createHandlers();

    parseEventBlock('event: notification', handlers);

    expect(handlers.onNotification).not.toHaveBeenCalled();
    expect(handlers.onError).not.toHaveBeenCalled();
  });

  it('event: 라인이 없으면 조기 return하고 어떤 핸들러도 호출하지 않는다', () => {
    const handlers = createHandlers();

    parseEventBlock('data: {}', handlers);

    expect(handlers.onNotificationRefresh).not.toHaveBeenCalled();
    expect(handlers.onError).not.toHaveBeenCalled();
  });
});
