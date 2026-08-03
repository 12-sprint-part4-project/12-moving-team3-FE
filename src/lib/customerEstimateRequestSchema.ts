import { z } from 'zod';

/** BE MoveType enum */
export const moveTypeSchema = z.enum(['SMALL', 'HOME', 'OFFICE']);

/** YYYY-MM-DD + 달력상 실존 날짜 */
export const moveDateSchema = z.iso.date({
  error: '날짜 형식이 올바르지 않습니다.',
});

const addressFieldSchema = z.string().trim().min(1, '주소를 입력해 주세요.');

const step1DataSchema = z.object({
  moveType: moveTypeSchema,
});

const step2DataSchema = z.object({
  moveDate: moveDateSchema,
});

const step3DataSchema = z.object({
  departureZipCode: addressFieldSchema,
  departureAddress: addressFieldSchema,
  departureDetailAddress: addressFieldSchema,
  arrivalZipCode: addressFieldSchema,
  arrivalAddress: addressFieldSchema,
  arrivalDetailAddress: addressFieldSchema,
});

/** 단계별 입력 저장 body — BE saveEstimateRequestStepBodySchema 와 동일 */
export const saveEstimateRequestStepBodySchema = z.discriminatedUnion('step', [
  z.object({
    step: z.literal(1),
    data: step1DataSchema,
  }),
  z.object({
    step: z.literal(2),
    data: step2DataSchema,
  }),
  z.object({
    step: z.literal(3),
    data: step3DataSchema,
  }),
]);

export type SaveEstimateRequestStepBody = z.infer<
  typeof saveEstimateRequestStepBodySchema
>;

/** 서버 입력 저장 스텝 (1~3) — save body의 step과 동일 */
export type EstimateRequestInputStep = SaveEstimateRequestStepBody['step'];

export const ESTIMATE_REQUEST_REVISABLE_FIELDS = [
  'moveType',
  'moveDate',
  'departureZipCode',
  'departureAddress',
  'departureDetailAddress',
  'arrivalZipCode',
  'arrivalAddress',
  'arrivalDetailAddress',
] as const;

/** 재수정 가능 필드 — ESTIMATE_REQUEST_REVISABLE_FIELDS와 동일 */
export type EstimateRequestRevisableField =
  (typeof ESTIMATE_REQUEST_REVISABLE_FIELDS)[number];

/** 완료 항목 재수정 body — field별 value 형식 검증 */
export const reviseEstimateRequestFieldBodySchema = z.discriminatedUnion(
  'field',
  [
    z.object({ field: z.literal('moveType'), value: moveTypeSchema }),
    z.object({ field: z.literal('moveDate'), value: moveDateSchema }),
    z.object({
      field: z.literal('departureZipCode'),
      value: addressFieldSchema,
    }),
    z.object({
      field: z.literal('departureAddress'),
      value: addressFieldSchema,
    }),
    z.object({
      field: z.literal('departureDetailAddress'),
      value: addressFieldSchema,
    }),
    z.object({
      field: z.literal('arrivalZipCode'),
      value: addressFieldSchema,
    }),
    z.object({
      field: z.literal('arrivalAddress'),
      value: addressFieldSchema,
    }),
    z.object({
      field: z.literal('arrivalDetailAddress'),
      value: addressFieldSchema,
    }),
  ]
);

export type ReviseEstimateRequestFieldBody = z.infer<
  typeof reviseEstimateRequestFieldBodySchema
>;

/** BE EstimateRequestStatus */
export const estimateRequestStatusSchema = z.enum([
  'DRAFT',
  'SUBMITTED',
  'CONFIRMED',
  'COMPLETED',
]);

const nullableMoveTypeSchema = moveTypeSchema.nullable();
const nullableStringSchema = z.string().nullable();

/** GET /active — request 요약 */
export const activeEstimateRequestSummarySchema = z.object({
  id: z.number(),
  status: estimateRequestStatusSchema,
  currentStep: z.number(),
  totalSteps: z.number(),
  moveType: nullableMoveTypeSchema,
  moveDate: nullableStringSchema,
  departureAddress: nullableStringSchema,
  arrivalAddress: nullableStringSchema,
});

/** GET /active — data */
export const activeEstimateRequestDataSchema = z.object({
  hasActiveRequest: z.boolean(),
  request: activeEstimateRequestSummarySchema.nullable(),
});

/** GET /:id — 상세 data */
export const estimateRequestDetailSchema = z.object({
  id: z.number(),
  status: estimateRequestStatusSchema,
  currentStep: z.number(),
  totalSteps: z.number(),
  moveType: nullableMoveTypeSchema,
  moveDate: nullableStringSchema,
  departureZipCode: nullableStringSchema,
  departureAddress: nullableStringSchema,
  departureDetailAddress: nullableStringSchema,
  arrivalZipCode: nullableStringSchema,
  arrivalAddress: nullableStringSchema,
  arrivalDetailAddress: nullableStringSchema,
});

/** POST / — DRAFT 생성 data */
export const createdEstimateRequestSchema = z.object({
  id: z.number(),
  status: estimateRequestStatusSchema,
  currentStep: z.number(),
  totalSteps: z.number(),
});

/** PATCH /:id/step — data */
export const saveEstimateRequestStepResultSchema = z.object({
  id: z.number(),
  currentStep: z.number(),
  totalSteps: z.number(),
  isReadyToSubmit: z.boolean(),
});

/** PATCH /:id/field — 수정한 필드만 포함 */
export const reviseEstimateRequestFieldResultSchema = z.object({
  id: z.number(),
  moveType: moveTypeSchema.nullable().optional(),
  moveDate: nullableStringSchema.optional(),
  departureZipCode: nullableStringSchema.optional(),
  departureAddress: nullableStringSchema.optional(),
  departureDetailAddress: nullableStringSchema.optional(),
  arrivalZipCode: nullableStringSchema.optional(),
  arrivalAddress: nullableStringSchema.optional(),
  arrivalDetailAddress: nullableStringSchema.optional(),
});

/** POST /:id/submit — data */
export const submitEstimateRequestResultSchema = z.object({
  id: z.number(),
  status: estimateRequestStatusSchema,
  submittedAt: z.string(),
});

/** 상세 응답 기준 제출 가능 여부 (필수 입력 필드 완성도) */
export const isEstimateRequestReadyToSubmit = (detail: {
  moveType: string | null;
  moveDate: string | null;
  departureZipCode: string | null;
  departureAddress: string | null;
  departureDetailAddress: string | null;
  arrivalZipCode: string | null;
  arrivalAddress: string | null;
  arrivalDetailAddress: string | null;
}): boolean =>
  detail.moveType != null &&
  detail.moveDate != null &&
  detail.departureZipCode != null &&
  detail.departureAddress != null &&
  detail.departureDetailAddress != null &&
  detail.arrivalZipCode != null &&
  detail.arrivalAddress != null &&
  detail.arrivalDetailAddress != null;

/**
 * 서버 currentStep 기준 FE 시각 스텝.
 * DRAFT는 입력 1~3만 — 확인용 Step4 UI 없음(필수값 완료여도 4로 올리지 않음).
 * non-DRAFT는 4(blocked 분기에서 Progress 미사용, 타입 호환용).
 */
export const toVisualStep = (
  status: string,
  currentStep: number,
  _detail: Parameters<typeof isEstimateRequestReadyToSubmit>[0]
): 1 | 2 | 3 | 4 => {
  if (status !== 'DRAFT') {
    return 4;
  }

  // 입력 스텝은 1~3으로 클램프 (EstimateRequestInputStep)
  const step = Math.min(
    Math.max(currentStep, 1),
    3
  ) as EstimateRequestInputStep;
  return step;
};
