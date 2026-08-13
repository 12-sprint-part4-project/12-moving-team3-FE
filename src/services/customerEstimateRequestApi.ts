import { API_ERROR_CODE } from '@/constants/errorCode';
import {
  API_BASE_URL,
  ApiError,
  DEFAULT_API_ERROR_MESSAGE,
  throwApiError,
} from '@/lib/apiClient';
import { authFetch } from '@/lib/authFetch';
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

const getAuthHeaders = (withJson = false): HeadersInit => ({
  ...(withJson ? { 'Content-Type': 'application/json' } : {}),
});

/** 성공 응답 data를 zod로 런타임 검증 */
const parseResponseData = <T>(schema: z.ZodType<T>, body: unknown): T => {
  if (!body || typeof body !== 'object' || !('data' in body)) {
    throw new ApiError(500, DEFAULT_API_ERROR_MESSAGE, API_ERROR_CODE.INVALID_RESPONSE);
  }

  const result = schema.safeParse((body as { data: unknown }).data);
  if (!result.success) {
    throw new ApiError(500, DEFAULT_API_ERROR_MESSAGE, API_ERROR_CODE.INVALID_RESPONSE);
  }

  return result.data;
};

/** zod 검증 실패도 ApiError로 통일 — 훅 오류 분기와 계약 맞춤 */
const parseRequestBody = <T>(schema: z.ZodType<T>, body: unknown): T => {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new ApiError(
      400,
      '요청 형식이 올바르지 않습니다.',
      API_ERROR_CODE.INVALID_REQUEST
    );
  }
  return result.data;
};

const isTimeoutError = (error: unknown): boolean => {
  const errorName =
    error instanceof DOMException || error instanceof Error
      ? error.name
      : undefined;
  return errorName === 'TimeoutError' || errorName === 'AbortError';
};

/** 네트워크·타임아웃 예외를 ApiError로 정규화 (chatApi와 동일 패턴, 도메인 로컬) */
const toNetworkApiError = (error: unknown): ApiError => {
  if (isTimeoutError(error)) {
    return new ApiError(408, '요청 시간이 초과되었습니다.', API_ERROR_CODE.TIMEOUT);
  }

  return new ApiError(0, '네트워크 오류가 발생했습니다.', API_ERROR_CODE.NETWORK_ERROR);
};

/**
 * authFetch + JSON 파싱 공통 처리.
 * fetch·본문 읽기 중 TimeoutError는 TIMEOUT ApiError로 변환한다.
 */
const requestJson = async <T>(
  path: string,
  init: RequestInit,
  schema: z.ZodType<T>
): Promise<T> => {
  let response: Response;

  try {
    response = await authFetch(`${API_BASE_URL}${path}`, {
      cache: 'no-store',
      ...init,
    });
  } catch (error) {
    throw toNetworkApiError(error);
  }

  if (!response.ok) {
    return throwApiError(response);
  }

  try {
    // .catch(() => null)로 타임아웃을 삼키지 않음
    const body: unknown = await response.json();
    return parseResponseData(schema, body);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (isTimeoutError(error)) {
      throw toNetworkApiError(error);
    }
    throw new ApiError(
      500,
      '요청 처리 중 오류가 발생했습니다.',
      API_ERROR_CODE.INVALID_RESPONSE
    );
  }
};

/**
 * 활성 견적요청 조회.
 * GET /api/estimate-requests/active
 */
export const getActiveEstimateRequest =
  async (): Promise<ActiveEstimateRequestData> => {
    return requestJson(
      `${BASE_PATH}/active`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      },
      activeEstimateRequestDataSchema
    );
  };

/**
 * DRAFT 견적요청 생성.
 * POST /api/estimate-requests
 */
export const createEstimateRequest =
  async (): Promise<CreatedEstimateRequest> => {
    return requestJson(
      BASE_PATH,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      },
      createdEstimateRequestSchema
    );
  };

/**
 * 견적요청 상세 조회.
 * GET /api/estimate-requests/:estimateRequestId
 */
export const getEstimateRequestDetail = async (
  estimateRequestId: number
): Promise<EstimateRequestDetail> => {
  return requestJson(
    `${BASE_PATH}/${estimateRequestId}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    },
    estimateRequestDetailSchema
  );
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

  return requestJson(
    `${BASE_PATH}/${estimateRequestId}/step`,
    {
      method: 'PATCH',
      headers: getAuthHeaders(true),
      body: JSON.stringify(parsed),
    },
    saveEstimateRequestStepResultSchema
  );
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

  return requestJson(
    `${BASE_PATH}/${estimateRequestId}/field`,
    {
      method: 'PATCH',
      headers: getAuthHeaders(true),
      body: JSON.stringify(parsed),
    },
    reviseEstimateRequestFieldResultSchema
  );
};

/**
 * 견적요청 제출.
 * POST /api/estimate-requests/:estimateRequestId/submit
 */
export const submitEstimateRequest = async (
  estimateRequestId: number
): Promise<SubmitEstimateRequestResult> => {
  return requestJson(
    `${BASE_PATH}/${estimateRequestId}/submit`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
    },
    submitEstimateRequestResultSchema
  );
};
