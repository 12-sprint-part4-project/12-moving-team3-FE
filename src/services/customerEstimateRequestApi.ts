import { ApiError, apiClient } from '@/lib/apiClient';
import type {
  ReviseEstimateRequestFieldBody,
  SaveEstimateRequestStepBody,
} from '@/lib/customerEstimateRequestSchema';
import {
  activeEstimateRequestDataSchema,
  createdEstimateRequestSchema,
  estimateRequestDetailSchema,
  reviseEstimateRequestFieldBodySchema,
  reviseEstimateRequestFieldResultSchema,
  saveEstimateRequestStepBodySchema,
  saveEstimateRequestStepResultSchema,
  submitEstimateRequestResultSchema,
} from '@/lib/customerEstimateRequestSchema';
import type {
  ActiveEstimateRequestData,
  CreatedEstimateRequest,
  EstimateRequestDetail,
  ReviseEstimateRequestFieldResult,
  SaveEstimateRequestStepResult,
  SubmitEstimateRequestResult,
} from '@/types/customerEstimateRequest';
import type { z } from 'zod';

const BASE_PATH = '/api/estimate-requests';

/** 성공 응답 data를 zod로 런타임 검증 */
const parseResponseData = <T>(schema: z.ZodType<T>, body: unknown): T => {
  if (!body || typeof body !== 'object' || !('data' in body)) {
    throw new ApiError(
      500,
      '요청 처리 중 오류가 발생했습니다.',
      'INVALID_RESPONSE'
    );
  }

  const result = schema.safeParse((body as { data: unknown }).data);
  if (!result.success) {
    throw new ApiError(
      500,
      '요청 처리 중 오류가 발생했습니다.',
      'INVALID_RESPONSE'
    );
  }

  return result.data;
};

/** zod 검증 실패도 ApiError로 통일 — 훅 오류 분기와 계약 맞춤 */
const parseRequestBody = <T>(schema: z.ZodType<T>, body: unknown): T => {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new ApiError(400, '요청 형식이 올바르지 않습니다.', 'INVALID_REQUEST');
  }
  return result.data;
};

/**
 * 활성 견적요청 조회.
 * GET /api/estimate-requests/active
 */
export const getActiveEstimateRequest =
  async (): Promise<ActiveEstimateRequestData> => {
    const body = await apiClient<unknown>(`${BASE_PATH}/active`, {
      method: 'GET',
      cache: 'no-store',
    });
    return parseResponseData(activeEstimateRequestDataSchema, body);
  };

/**
 * DRAFT 견적요청 생성.
 * POST /api/estimate-requests
 */
export const createEstimateRequest =
  async (): Promise<CreatedEstimateRequest> => {
    const body = await apiClient<unknown>(BASE_PATH, {
      method: 'POST',
      cache: 'no-store',
    });
    return parseResponseData(createdEstimateRequestSchema, body);
  };

/**
 * 견적요청 상세 조회.
 * GET /api/estimate-requests/:estimateRequestId
 */
export const getEstimateRequestDetail = async (
  estimateRequestId: number
): Promise<EstimateRequestDetail> => {
  const body = await apiClient<unknown>(`${BASE_PATH}/${estimateRequestId}`, {
    method: 'GET',
    cache: 'no-store',
  });
  return parseResponseData(estimateRequestDetailSchema, body);
};

/**
 * 단계별 입력 저장 (step 1~3).
 * PATCH /api/estimate-requests/:estimateRequestId/step
 */
export const saveEstimateRequestStep = async (
  estimateRequestId: number,
  body: SaveEstimateRequestStepBody
): Promise<SaveEstimateRequestStepResult> => {
  const parsed = parseRequestBody(saveEstimateRequestStepBodySchema, body);

  const json = await apiClient<unknown>(
    `${BASE_PATH}/${estimateRequestId}/step`,
    {
      method: 'PATCH',
      cache: 'no-store',
      body: parsed,
    }
  );
  return parseResponseData(saveEstimateRequestStepResultSchema, json);
};

/**
 * 완료 항목 단건 재수정.
 * PATCH /api/estimate-requests/:estimateRequestId/field
 */
export const reviseEstimateRequestField = async (
  estimateRequestId: number,
  body: ReviseEstimateRequestFieldBody
): Promise<ReviseEstimateRequestFieldResult> => {
  const parsed = parseRequestBody(reviseEstimateRequestFieldBodySchema, body);

  const json = await apiClient<unknown>(
    `${BASE_PATH}/${estimateRequestId}/field`,
    {
      method: 'PATCH',
      cache: 'no-store',
      body: parsed,
    }
  );
  return parseResponseData(reviseEstimateRequestFieldResultSchema, json);
};

/**
 * 견적요청 제출.
 * POST /api/estimate-requests/:estimateRequestId/submit
 */
export const submitEstimateRequest = async (
  estimateRequestId: number
): Promise<SubmitEstimateRequestResult> => {
  const json = await apiClient<unknown>(
    `${BASE_PATH}/${estimateRequestId}/submit`,
    {
      method: 'POST',
      cache: 'no-store',
    }
  );
  return parseResponseData(submitEstimateRequestResultSchema, json);
};
