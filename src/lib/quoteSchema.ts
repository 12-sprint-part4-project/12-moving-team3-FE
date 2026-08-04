import { z } from 'zod';

import { moveTypeSchema } from '@/lib/customerEstimateRequestSchema';

/** 견적 상태 */
export const quoteStatusSchema = z.enum(['PENDING', 'CONFIRMED', 'REJECTED']);

/** 견적 요청 상태 */
export const estimateRequestStatusForQuoteSchema = z.enum([
  'DRAFT',
  'SUBMITTED',
  'CONFIRMED',
  'COMPLETED',
  'EXPIRED',
  'CANCELED',
]);

/** 목록/상세 공통 고객 구조 */
const quoteCustomerSchema = z.object({
  name: z.string(),
});

/** 견적 목록 meta */
export const quoteListMetaSchema = z.object({
  totalCount: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  limit: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

const quoteListItemBaseSchema = z.object({
  id: z.number(),
  estimateRequestId: z.number(),
  customer: quoteCustomerSchema,
  moveType: moveTypeSchema.nullable(),
  isDesignated: z.boolean(),
  moveDate: z.string().nullable(),
  fromRegionLabel: z.string().nullable(),
  toRegionLabel: z.string().nullable(),
  createdAt: z.string(),
});

/** 반려 견적 목록 아이템 */
export const rejectedQuoteListItemSchema = quoteListItemBaseSchema;

/** 보낸 견적 목록 아이템 */
export const sentQuoteListItemSchema = quoteListItemBaseSchema.extend({
  isConfirmed: z.boolean(),
  price: z.number().nullable(),
  estimateRequestStatus: estimateRequestStatusForQuoteSchema,
  isMoveCompleted: z.boolean(),
});

/** 보낸/반려 목록 아이템 유니온 */
export const quoteListItemSchema = z.union([
  sentQuoteListItemSchema,
  rejectedQuoteListItemSchema,
]);

/** GET /api/users/movers/quotes 응답 */
export const quoteListResponseSchema = z.object({
  data: z.object({
    items: z.array(quoteListItemSchema),
  }),
  meta: quoteListMetaSchema,
});

/** 견적 제출/반려 응답 data */
export const quoteSubmitResultSchema = z.object({
  id: z.number(),
  estimateRequestId: z.number(),
  moverId: z.string(),
  price: z.number().nullable(),
  comment: z.string().nullable(),
  rejectReason: z.string().nullable(),
  status: quoteStatusSchema,
  isDesignated: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

/** POST .../quotes 응답 */
export const quoteSubmitResponseSchema = z.object({
  data: quoteSubmitResultSchema,
});
