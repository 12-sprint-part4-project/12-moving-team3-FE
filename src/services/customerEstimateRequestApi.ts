import type {
  ReviseEstimateRequestFieldBody,
  SaveEstimateRequestStepBody,
} from '@/lib/customerEstimateRequestSchema';
import {
  reviseEstimateRequestFieldBodySchema,
  saveEstimateRequestStepBodySchema,
} from '@/lib/customerEstimateRequestSchema';
import {
  API_BASE_URL,
  ApiError,
  createApiTimeoutSignal,
  getAccessToken,
} from '@/services/apiClient';
import type { ApiErrorBody } from '@/types/api';
import type {
  ActiveEstimateRequestData,
  ActiveEstimateRequestResponse,
  CreatedEstimateRequest,
  CreatedEstimateRequestResponse,
  EstimateRequestDetail,
  EstimateRequestDetailResponse,
  ReviseEstimateRequestFieldResult,
  ReviseEstimateRequestFieldResponse,
  SaveEstimateRequestStepResult,
  SaveEstimateRequestStepResponse,
  SubmitEstimateRequestResult,
  SubmitEstimateRequestResponse,
} from '@/types/customerEstimateRequest';

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
    body?.error?.code ?? 'UNKNOWN_ERROR',
    body?.error?.message ?? '요청 처리 중 오류가 발생했습니다.'
  );
};

/** JSON 본문에서 data 래퍼를 검증 */
const unwrapData = <T>(body: unknown): T => {
  if (!body || typeof body !== 'object' || !('data' in body)) {
    throw new ApiError(
      500,
      'INVALID_RESPONSE',
      '요청 처리 중 오류가 발생했습니다.'
    );
  }

  return (body as { data: T }).data;
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

    const body =
      (await response.json()) as ActiveEstimateRequestResponse | null;
    return unwrapData<ActiveEstimateRequestData>(body);
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

    const body =
      (await response.json()) as CreatedEstimateRequestResponse | null;
    return unwrapData<CreatedEstimateRequest>(body);
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

  const body = (await response.json()) as EstimateRequestDetailResponse | null;
  return unwrapData<EstimateRequestDetail>(body);
};

/**
 * 단계별 입력 저장 (step 1~3).
 * PATCH /api/estimate-requests/:estimateRequestId/step
 */
export const saveEstimateRequestStep = async (
  estimateRequestId: number,
  body: SaveEstimateRequestStepBody
): Promise<SaveEstimateRequestStepResult> => {
  // 클라이언트에서도 BE와 동일한 zod로 검증
  const parsed = saveEstimateRequestStepBodySchema.parse(body);

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

  const json =
    (await response.json()) as SaveEstimateRequestStepResponse | null;
  return unwrapData<SaveEstimateRequestStepResult>(json);
};

/**
 * 완료 항목 단건 재수정.
 * PATCH /api/estimate-requests/:estimateRequestId/field
 */
export const reviseEstimateRequestField = async (
  estimateRequestId: number,
  body: ReviseEstimateRequestFieldBody
): Promise<ReviseEstimateRequestFieldResult> => {
  const parsed = reviseEstimateRequestFieldBodySchema.parse(body);

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

  const json =
    (await response.json()) as ReviseEstimateRequestFieldResponse | null;
  return unwrapData<ReviseEstimateRequestFieldResult>(json);
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

  const json =
    (await response.json()) as SubmitEstimateRequestResponse | null;
  return unwrapData<SubmitEstimateRequestResult>(json);
};
