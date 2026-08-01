import { ApiError } from '@/lib/apiClient';
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
import {
  API_BASE_URL,
  createApiTimeoutSignal,
  getAccessToken,
} from '@/services/apiClient.legacy';
import type { ApiErrorBody } from '@/types/api';
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

const getAuthHeaders = (withJson = false): HeadersInit => {
  const token = getAccessToken();

  return {
    ...(withJson ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/** 실패 응답을 ApiError 로 변환 */
const parseError = async (response: Response): Promise<never> => {
  const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
  throw new ApiError(
    response.status,
    body?.error?.message ?? '요청 처리 중 오류가 발생했습니다.',
    body?.error?.code ?? 'UNKNOWN_ERROR'
  );
};

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
    const response = await fetch(`${API_BASE_URL}${BASE_PATH}/active`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: getAuthHeaders(),
      signal: createApiTimeoutSignal(),
    });

    if (!response.ok) {
      return parseError(response);
    }

    const body: unknown = await response.json().catch(() => null);
    return parseResponseData(activeEstimateRequestDataSchema, body);
  };

/**
 * DRAFT 견적요청 생성.
 * POST /api/estimate-requests
 */
export const createEstimateRequest =
  async (): Promise<CreatedEstimateRequest> => {
    const response = await fetch(`${API_BASE_URL}${BASE_PATH}`, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: getAuthHeaders(),
      signal: createApiTimeoutSignal(),
    });

    if (!response.ok) {
      return parseError(response);
    }

    const body: unknown = await response.json().catch(() => null);
    return parseResponseData(createdEstimateRequestSchema, body);
  };

/**
 * 견적요청 상세 조회.
 * GET /api/estimate-requests/:estimateRequestId
 */
export const getEstimateRequestDetail = async (
  estimateRequestId: number
): Promise<EstimateRequestDetail> => {
  const response = await fetch(
    `${API_BASE_URL}${BASE_PATH}/${estimateRequestId}`,
    {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: getAuthHeaders(),
      signal: createApiTimeoutSignal(),
    }
  );

  if (!response.ok) {
    return parseError(response);
  }

  const body: unknown = await response.json().catch(() => null);
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
  // 클라이언트에서도 BE와 동일한 zod로 검증 (실패 시 ApiError)
  const parsed = parseRequestBody(saveEstimateRequestStepBodySchema, body);

  const response = await fetch(
    `${API_BASE_URL}${BASE_PATH}/${estimateRequestId}/step`,
    {
      method: 'PATCH',
      credentials: 'include',
      cache: 'no-store',
      headers: getAuthHeaders(true),
      body: JSON.stringify(parsed),
      signal: createApiTimeoutSignal(),
    }
  );

  if (!response.ok) {
    return parseError(response);
  }

  const json: unknown = await response.json().catch(() => null);
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
  // 검증 실패 시 ZodError 대신 ApiError로 통일
  const parsed = parseRequestBody(reviseEstimateRequestFieldBodySchema, body);

  const response = await fetch(
    `${API_BASE_URL}${BASE_PATH}/${estimateRequestId}/field`,
    {
      method: 'PATCH',
      credentials: 'include',
      cache: 'no-store',
      headers: getAuthHeaders(true),
      body: JSON.stringify(parsed),
      signal: createApiTimeoutSignal(),
    }
  );

  if (!response.ok) {
    return parseError(response);
  }

  const json: unknown = await response.json().catch(() => null);
  return parseResponseData(reviseEstimateRequestFieldResultSchema, json);
};

/**
 * 견적요청 제출.
 * POST /api/estimate-requests/:estimateRequestId/submit
 */
export const submitEstimateRequest = async (
  estimateRequestId: number
): Promise<SubmitEstimateRequestResult> => {
  const response = await fetch(
    `${API_BASE_URL}${BASE_PATH}/${estimateRequestId}/submit`,
    {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: getAuthHeaders(),
      signal: createApiTimeoutSignal(),
    }
  );

  if (!response.ok) {
    return parseError(response);
  }

  const json: unknown = await response.json().catch(() => null);
  return parseResponseData(submitEstimateRequestResultSchema, json);
};
