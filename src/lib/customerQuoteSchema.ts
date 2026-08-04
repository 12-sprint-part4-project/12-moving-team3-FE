import { z } from 'zod';

import { moveTypeSchema } from '@/lib/customerEstimateRequestSchema';

/** 고객 견적 상태 */
export const customerQuoteStatusSchema = z.enum(['PENDING', 'CONFIRMED']);

/** 고객 견적 기사님 카드 */
export const customerQuoteMoverSchema = z.object({
  moverId: z.string(),
  nickname: z.string(),
  profileImage: z.string().nullable(),
  rating: z.number(),
  reviewCount: z.number(),
  career: z.number().nullable(),
  confirmedQuoteCount: z.number(),
  favoriteCount: z.number(),
  isFavorited: z.boolean(),
});

/** 고객 견적 목록 아이템 */
export const customerQuoteItemSchema = z.object({
  quoteId: z.number(),
  price: z.number().nullable(),
  status: customerQuoteStatusSchema,
  isDesignated: z.boolean(),
  mover: customerQuoteMoverSchema,
});

/** GET /api/users/customers/quotes 응답 */
export const customerPendingQuotesResponseSchema = z.object({
  data: z
    .object({
      estimateRequestId: z.number(),
      status: z.literal('SUBMITTED'),
      submittedAt: z.string().nullable(),
      serviceType: moveTypeSchema.nullable(),
      moveDate: z.string().nullable(),
      fromAddress: z.string().nullable(),
      toAddress: z.string().nullable(),
      quoteCount: z.object({
        general: z.number(),
        designated: z.number(),
      }),
      quotes: z.array(customerQuoteItemSchema),
    })
    .nullable(),
});

/** GET /api/users/customers/quotes/:quoteId 응답 */
export const customerQuoteDetailResponseSchema = z.object({
  data: z.object({
    quoteId: z.number(),
    estimateRequestId: z.number(),
    price: z.number().nullable(),
    comment: z.string().nullable(),
    status: customerQuoteStatusSchema,
    isDesignated: z.boolean(),
    serviceType: moveTypeSchema.nullable(),
    moveDate: z.string().nullable(),
    submittedAt: z.string().nullable(),
    fromAddress: z.string().nullable(),
    toAddress: z.string().nullable(),
    mover: customerQuoteMoverSchema,
  }),
});

/** PATCH /api/users/customers/quotes/:quoteId 응답 */
export const confirmCustomerQuoteResponseSchema = z.object({
  data: z.object({
    confirmedQuoteId: z.number(),
  }),
});
