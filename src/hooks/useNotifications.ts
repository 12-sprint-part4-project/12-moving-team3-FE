import { useQuery } from '@tanstack/react-query';

import { getNotifications } from '@/services/notificationApi';

/** SSE 푸시가 주 갱신 경로이므로 REST 재조회는 덜 자주 한다 */
const NOTIFICATION_STALE_TIME_MS = 30_000;

export const notificationQueryKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationQueryKeys.all, 'list'] as const,
  /** 역할 없이 단일 목록 키 — GET /api/notifications */
  list: () => [...notificationQueryKeys.lists()] as const,
};

/**
 * 알림 목록 조회.
 * unreadCount는 목록 items 기준 파생값 (미읽음 서버 meta 없음).
 */
export const useNotifications = () => {
  const query = useQuery({
    queryKey: notificationQueryKeys.list(),
    queryFn: () => getNotifications(),
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
