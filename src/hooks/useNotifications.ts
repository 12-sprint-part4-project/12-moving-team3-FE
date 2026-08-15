import { useQuery } from '@tanstack/react-query';

import { notificationQueryKeys } from '@/constants/queryKey';
import { getNotifications } from '@/services/notificationApi';

/** SSE 푸시가 주 갱신 경로이므로 REST 재조회는 덜 자주 한다 */
const NOTIFICATION_STALE_TIME_MS = 30_000;

/**
 * 알림 목록 조회.
 * unreadCount는 목록 items 기준 파생값 (미읽음 서버 meta 없음).
 * 전체 알림 보기 페이지가 없어 드롭다운(최신 10건) 밖의 미읽음은 어차피 사용자가 확인할 방법이 없으므로,
 * 정확한 전체 미읽음 수 대신 드롭다운에서 항상 해결 가능한 값만 보여준다(2026-08-15 보류 결정).
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
