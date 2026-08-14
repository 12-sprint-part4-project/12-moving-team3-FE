import { useQuery } from '@tanstack/react-query';

import { notificationQueryKeys } from '@/constants/queryKey';
import { getNotifications } from '@/services/notificationApi';

/** SSE 푸시가 주 갱신 경로이므로 REST 재조회는 덜 자주 한다 */
const NOTIFICATION_STALE_TIME_MS = 30_000;

/**
 * 알림 목록 조회.
 * unreadCount는 서버 meta 값(전체 기준) 우선, 아직 없으면(BE 미배포 구간) items 기준 파생값으로 폴백.
 */
export const useNotifications = () => {
  const query = useQuery({
    queryKey: notificationQueryKeys.list(),
    queryFn: () => getNotifications(),
    staleTime: NOTIFICATION_STALE_TIME_MS,
  });

  const items = query.data?.data.items ?? [];
  const totalCount = query.data?.meta.totalCount ?? 0;
  const unreadCount =
    query.data?.meta.unreadCount ??
    items.filter((item) => !item.isRead).length;

  return {
    ...query,
    items,
    totalCount,
    unreadCount,
  };
};
