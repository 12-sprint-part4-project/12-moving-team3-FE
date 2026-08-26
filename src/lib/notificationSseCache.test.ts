import { QueryClient } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { estimateRequestQueryKeys, notificationQueryKeys } from '@/constants/queryKey';
import { invalidateChatRoomListAndDetails } from '@/lib/chatQueryCache';

import {
  applyNotificationToCache,
  invalidateChatQueriesForNotification,
  invalidateNotificationList,
  invalidateReceivedRequestsList,
} from './notificationSseCache';

import type { NotificationItem, NotificationListResponse } from '@/types/notification';

vi.mock('@/lib/chatQueryCache');

const mockInvalidateChatRoomListAndDetails = vi.mocked(
  invalidateChatRoomListAndDetails
);

const createItem = (id: number): NotificationItem => ({
  id,
  type: 'REVIEW_WRITTEN',
  content: `알림 ${id}`,
  payload: {},
  isRead: false,
  createdAt: '2026-08-26T00:00:00.000Z',
  quoteId: null,
  estimateRequestId: null,
  commentId: null,
  reviewId: null,
  userReportId: null,
});

const createListResponse = (items: NotificationItem[]): NotificationListResponse => ({
  data: { items },
  meta: { totalCount: items.length },
});

let queryClient: QueryClient;

beforeEach(() => {
  vi.clearAllMocks();
  queryClient = new QueryClient();
});

describe('applyNotificationToCache', () => {
  it('캐시가 없으면 목록 쿼리를 invalidate한다', () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    applyNotificationToCache(queryClient, createItem(1));

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: notificationQueryKeys.list(),
    });
  });

  it('캐시가 있으면 새 알림을 맨 앞에 추가하고 totalCount를 증가시킨다', () => {
    const existing = createListResponse([createItem(1)]);
    queryClient.setQueryData(notificationQueryKeys.list(), existing);

    applyNotificationToCache(queryClient, createItem(2));

    const updated = queryClient.getQueryData<NotificationListResponse>(
      notificationQueryKeys.list()
    );
    expect(updated?.data.items.map((item) => item.id)).toEqual([2, 1]);
    expect(updated?.meta.totalCount).toBe(2);
  });

  it('이미 존재하는 id면 멱등하게 무시한다', () => {
    const existing = createListResponse([createItem(1), createItem(2)]);
    queryClient.setQueryData(notificationQueryKeys.list(), existing);

    applyNotificationToCache(queryClient, createItem(2));

    const updated = queryClient.getQueryData<NotificationListResponse>(
      notificationQueryKeys.list()
    );
    expect(updated).toEqual(existing);
  });

  it('10개를 초과하면 최신 10개만 유지한다', () => {
    const items = Array.from({ length: 10 }, (_, index) => createItem(index + 1));
    queryClient.setQueryData(notificationQueryKeys.list(), createListResponse(items));

    applyNotificationToCache(queryClient, createItem(11));

    const updated = queryClient.getQueryData<NotificationListResponse>(
      notificationQueryKeys.list()
    );
    expect(updated?.data.items).toHaveLength(10);
    expect(updated?.data.items[0]?.id).toBe(11);
    expect(updated?.data.items.map((item) => item.id)).not.toContain(10);
  });
});

describe('invalidateChatQueriesForNotification', () => {
  it.each([
    'NEW_QUOTE_OFFER_ARRIVED',
    'NEW_DESIGNATED_QUOTE_OFFER_ARRIVED',
    'NEW_DESIGNATED_QUOTE_REQUEST_ARRIVED',
    'QUOTE_CONFIRMED',
    'DESIGNATED_QUOTE_REJECTED',
    'CHAT_ROOM_OPENED',
  ] as const)('%s는 채팅 목록·상세 캐시를 무효화한다', (type) => {
    invalidateChatQueriesForNotification(queryClient, type);

    expect(mockInvalidateChatRoomListAndDetails).toHaveBeenCalledWith(queryClient);
  });

  it.each(['REVIEW_WRITTEN', 'COMMUNITY_COMMENT', 'SANCTION_NOTIFIED'] as const)(
    '%s는 채팅 캐시를 무효화하지 않는다',
    (type) => {
      invalidateChatQueriesForNotification(queryClient, type);

      expect(mockInvalidateChatRoomListAndDetails).not.toHaveBeenCalled();
    }
  );
});

describe('invalidateReceivedRequestsList', () => {
  it('받은 요청 목록 쿼리를 invalidate한다', () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    invalidateReceivedRequestsList(queryClient);

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: estimateRequestQueryKeys.receivedLists(),
    });
  });
});

describe('invalidateNotificationList', () => {
  it('알림 목록 쿼리를 invalidate한다', () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    invalidateNotificationList(queryClient);

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: notificationQueryKeys.list(),
    });
  });
});
