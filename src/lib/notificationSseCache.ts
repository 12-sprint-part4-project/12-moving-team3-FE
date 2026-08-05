import type { QueryClient } from '@tanstack/react-query';

import { notificationQueryKeys } from '@/hooks/useNotifications';
import type {
  NotificationItem,
  NotificationListResponse,
  NotificationRole,
} from '@/types/notification';

/** BE 드롭다운과 동일하게 최신 최대 10개만 유지 */
const NOTIFICATION_LIST_LIMIT = 10;

/**
 * SSE `notification` 이벤트를 역할별 목록 캐시에 prepend한다.
 * id 기준 멱등 처리, 캐시가 없으면 활성 쿼리만 invalidate한다.
 */
export const applyNotificationToCache = (
  queryClient: QueryClient,
  role: NotificationRole,
  item: NotificationItem
): void => {
  const queryKey = notificationQueryKeys.list(role);
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

/** SSE `unread-count` 안전망 — 목록을 다시 맞춰 unread 파생값을 갱신한다. */
export const invalidateNotificationList = (
  queryClient: QueryClient,
  role: NotificationRole
): void => {
  void queryClient.invalidateQueries({
    queryKey: notificationQueryKeys.list(role),
  });
};
