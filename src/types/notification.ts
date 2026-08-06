import type { ApiUserType } from '@/types/auth';

/** BE NotificationType 12종 — 타입·zod 공통 소스 */
export const NOTIFICATION_TYPES = [
  'NEW_QUOTE_REQUEST_ARRIVED',
  'NEW_DESIGNATED_QUOTE_REQUEST_ARRIVED',
  'NEW_QUOTE_OFFER_ARRIVED',
  'NEW_DESIGNATED_QUOTE_OFFER_ARRIVED',
  'QUOTE_CONFIRMED',
  'DESIGNATED_QUOTE_REJECTED',
  'CUSTOMER_MOVE_DAY_REMINDER',
  'MOVER_MOVE_DAY_REMINDER',
  'REVIEW_REQUESTED',
  'REVIEW_WRITTEN',
  'COMMUNITY_COMMENT',
  'SANCTION_NOTIFIED',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

/** 딥링크용 역할 (목록 API path와 무관) */
export type NotificationRole = 'customer' | 'mover';

/** 알림 목록 아이템 (BE NotificationListItem) */
export interface NotificationItem {
  id: number;
  type: NotificationType;
  content: string;
  payload: Record<string, string>;
  isRead: boolean;
  createdAt: string;
  quoteId: number | null;
  estimateRequestId: number | null;
}

/** GET /api/notifications 응답 */
export interface NotificationListResponse {
  data: {
    items: NotificationItem[];
  };
  meta: {
    totalCount: number;
  };
}

/** Auth userType → 딥링크용 NotificationRole (Header navRole과 동일) */
export const toNotificationRole = (
  userType: ApiUserType
): NotificationRole => (userType === 'MOVER' ? 'mover' : 'customer');
