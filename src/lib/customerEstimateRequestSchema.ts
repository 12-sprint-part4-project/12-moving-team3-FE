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

/** 완료 항목 재수정 body */
export const reviseEstimateRequestFieldBodySchema = z.object({
  field: z.enum(ESTIMATE_REQUEST_REVISABLE_FIELDS),
  value: z.string().trim().min(1, '값을 입력해 주세요.'),
});

export type ReviseEstimateRequestFieldBody = z.infer<
  typeof reviseEstimateRequestFieldBodySchema
>;

/** 상세 응답 기준 제출 가능 여부 (step3 완료 후 확인 UI 판단용) */
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
 * 서버 currentStep + 필드 완성도로 FE 시각 스텝 계산.
 * DRAFT에서 필수값이 모두 있으면 확인 UI(4), 그 외에는 currentStep(1~3).
 */
export const toVisualStep = (
  status: string,
  currentStep: number,
  detail: Parameters<typeof isEstimateRequestReadyToSubmit>[0]
): 1 | 2 | 3 | 4 => {
  if (status !== 'DRAFT') {
    return 4;
  }

  if (isEstimateRequestReadyToSubmit(detail)) {
    return 4;
  }

  const step = Math.min(Math.max(currentStep, 1), 3);
  return step as 1 | 2 | 3;
};
