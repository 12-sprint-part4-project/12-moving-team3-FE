import { useQuery } from '@tanstack/react-query';

import { getNotifications } from '@/services/notificationApi';
import type { NotificationRole } from '@/types/notification';

/** SSE 연동 전 임시 신선도 (10초) */
const NOTIFICATION_STALE_TIME_MS = 10_000;

export const notificationQueryKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationQueryKeys.all, 'list'] as const,
  list: (role: NotificationRole) =>
    [...notificationQueryKeys.lists(), role] as const,
};

/**
 * 역할별 알림 목록 조회.
 * unreadCount는 목록 items 기준 파생값 (미읽음 서버 meta 없음).
 */
export const useNotifications = (role: NotificationRole) => {
  const query = useQuery({
    queryKey: notificationQueryKeys.list(role),
    queryFn: () => getNotifications(role),
    staleTime: NOTIFICATION_STALE_TIME_MS,
  });

  const items = query.data?.data.items ?? [];
  const totalCount = query.data?.meta.totalCount ?? 0;
  const unreadCount = items.filter((item) => !item.isRead).length;

  return {
    ...query,
    items,
    totalCount,
    unreadCount,
  };
};
