import type { QueryClient } from '@tanstack/react-query';

import { chatQueryKeys } from '@/hooks/useChat';
import { notificationQueryKeys } from '@/hooks/useNotifications';
import type {
  NotificationItem,
  NotificationListResponse,
  NotificationType,
} from '@/types/notification';

/** BE 드롭다운과 동일하게 최신 최대 10개만 유지 */
const NOTIFICATION_LIST_LIMIT = 10;

/**
 * 채팅 칩·isMessagingAllowed에 영향 있는 알림.
 * 상대방 브라우저에서는 mutation invalidate가 안 되므로 SSE로 rooms/room을 맞춘다 (#208).
 * NEW_DESIGNATED_QUOTE_REQUEST_ARRIVED: 고객 지정 → 기사 칩 `지정 요청` (#216, BE #292).
 */
const CHAT_STATUS_NOTIFICATION_TYPES: ReadonlySet<NotificationType> = new Set([
  'NEW_QUOTE_OFFER_ARRIVED',
  'NEW_DESIGNATED_QUOTE_OFFER_ARRIVED',
  'NEW_DESIGNATED_QUOTE_REQUEST_ARRIVED',
  'QUOTE_CONFIRMED',
  'DESIGNATED_QUOTE_REJECTED',
  'CHAT_ROOM_OPENED',
]);

/**
 * SSE `notification` 이벤트를 목록 캐시에 prepend한다.
 * id 기준 멱등 처리, 캐시가 없으면 활성 쿼리만 invalidate한다.
 */
export const applyNotificationToCache = (
  queryClient: QueryClient,
  item: NotificationItem
): void => {
  const queryKey = notificationQueryKeys.list();
  const current = queryClient.getQueryData<NotificationListResponse>(queryKey);

  if (!current) {
    void queryClient.invalidateQueries({ queryKey });
    return;
  }

  if (current.data.items.some((existing) => existing.id === item.id)) {
    return;
  }

  queryClient.setQueryData<NotificationListResponse>(queryKey, {
    ...current,
    data: {
      items: [item, ...current.data.items].slice(0, NOTIFICATION_LIST_LIMIT),
    },
    meta: {
      totalCount: current.meta.totalCount + 1,
    },
  });
};

/**
 * 견적·지정·채팅 상태 알림이면 채팅 목록·상세 캐시를 무효화한다.
 * (예: 기사 반려 → 고객 SSE → 칩 `반려` / 고객 지정 → 기사 SSE → 칩 `지정 요청`)
 */
export const invalidateChatQueriesForNotification = (
  queryClient: QueryClient,
  type: NotificationType
): void => {
  if (!CHAT_STATUS_NOTIFICATION_TYPES.has(type)) {
    return;
  }

  void queryClient.invalidateQueries({
    queryKey: chatQueryKeys.rooms(),
  });
  void queryClient.invalidateQueries({
    queryKey: [...chatQueryKeys.all, 'room'],
  });
};

/** SSE `unread-count` 안전망 — 목록을 다시 맞춰 unread 파생값을 갱신한다. */
export const invalidateNotificationList = (
  queryClient: QueryClient
): void => {
  void queryClient.invalidateQueries({
    queryKey: notificationQueryKeys.list(),
  });
};
