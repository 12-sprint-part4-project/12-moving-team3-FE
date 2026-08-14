import { z } from 'zod';

import { NOTIFICATION_TYPES } from '@/types/notification';

/** BE NotificationType — NOTIFICATION_TYPES 단일 소스 */
export const notificationTypeSchema = z.enum(NOTIFICATION_TYPES);

/** 알림 목록/읽음 공통 아이템 */
export const notificationItemSchema = z.object({
  id: z.number(),
  type: notificationTypeSchema,
  content: z.string(),
  // BE toPayloadRecord와 동일 — string 값만 허용
  payload: z.record(z.string(), z.string()),
  isRead: z.boolean(),
  createdAt: z.string(),
  quoteId: z.number().nullable(),
  estimateRequestId: z.number().nullable(),
  commentId: z.number().nullable(),
  reviewId: z.number().nullable(),
  userReportId: z.number().nullable(),
});

/** GET /api/notifications 응답 */
export const notificationListResponseSchema = z.object({
  data: z.object({
    items: z.array(notificationItemSchema),
  }),
  meta: z.object({
    totalCount: z.number(),
    // BE 미배포 구간 대비 optional — 없으면 FE가 items 기준으로 폴백
    unreadCount: z.number().optional(),
  }),
});

/** PATCH /api/notifications/:id 응답 */
export const notificationMarkReadResponseSchema = z.object({
  data: notificationItemSchema,
});

/** SSE unread-count 이벤트 payload */
export const notificationSseUnreadCountSchema = z.object({
  unreadCount: z.number().int().nonnegative(),
});

/** SSE notification-refresh 이벤트 payload — BE Outbox fan-out는 `{}`만 보낸다 */
export const notificationSseRefreshSchema = z.strictObject({});
