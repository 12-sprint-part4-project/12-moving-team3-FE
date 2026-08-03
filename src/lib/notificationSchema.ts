import { z } from 'zod';

/** BE NotificationType 12종 */
export const notificationTypeSchema = z.enum([
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
]);

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
});

/** GET /api/notifications/{role} 응답 */
export const notificationListResponseSchema = z.object({
  data: z.object({
    items: z.array(notificationItemSchema),
  }),
  meta: z.object({
    totalCount: z.number(),
  }),
});

/** PATCH /api/notifications/:id 응답 */
export const notificationMarkReadResponseSchema = z.object({
  data: notificationItemSchema,
});
