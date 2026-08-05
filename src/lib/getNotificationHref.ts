import type {
  NotificationItem,
  NotificationRole,
} from '@/types/notification';

/**
 * 알림 클릭 시 이동 경로.
 * quoteId 우선 → 상세, estimateRequestId만 있으면 목록, 둘 다 없으면 null.
 */
export const getNotificationHref = (
  item: NotificationItem,
  role: NotificationRole
): string | null => {
  if (item.quoteId != null) {
    return role === 'mover'
      ? `/mover/quotes/${item.quoteId}`
      : `/quotes/${item.quoteId}`;
  }

  if (item.estimateRequestId != null) {
    return role === 'mover' ? '/mover/requests' : '/quotes';
  }

  return null;
};
