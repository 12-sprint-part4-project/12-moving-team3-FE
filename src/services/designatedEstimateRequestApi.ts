import { API_ERROR_CODE } from '@/constants/errorCode';
import {
  API_BASE_URL,
  ApiError,
  DEFAULT_API_ERROR_MESSAGE,
  throwApiError,
} from '@/lib/apiClient';
import { authFetch } from '@/lib/authFetch';
import {
  createDesignatedEstimateBodySchema,
  designatedEstimateExistenceSchema,
  designatedEstimateMoverSchema,
  type CreateDesignatedEstimateBody,
  type DesignatedEstimateExistence,
  type DesignatedEstimateMover,
} from '@/lib/designatedEstimateRequestSchema';
import type { z } from 'zod';

const BASE_PATH = '/api/designated-estimate-requests';

const isTimeoutError = (error: unknown): boolean => {
  const errorName =
    error instanceof DOMException || error instanceof Error
      ? error.name
      : undefined;
  return errorName === 'TimeoutError' || errorName === 'AbortError';
};

const toNetworkApiError = (error: unknown): ApiError => {
  if (isTimeoutError(error)) {
    return new ApiError(408, '요청 시간이 초과되었습니다.', API_ERROR_CODE.TIMEOUT);
  }

  return new ApiError(0, '네트워크 오류가 발생했습니다.', API_ERROR_CODE.NETWORK_ERROR);
};

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
 * 지정 견적 존재 여부 조회.
 * GET /api/designated-estimate-requests/:estimateRequestId/movers/:moverId
 */
export const getDesignatedEstimateExistence = async (
  estimateRequestId: number,
  moverId: string
): Promise<DesignatedEstimateExistence> => {
  return requestJson(
    `${BASE_PATH}/${estimateRequestId}/movers/${moverId}`,
    {
      method: 'GET',
      headers: {},
    },
    designatedEstimateExistenceSchema
  );
};

/**
 * 지정 견적 요청 생성.
 * POST /api/designated-estimate-requests
 */
export const createDesignatedEstimateRequest = async (
  body: CreateDesignatedEstimateBody
): Promise<DesignatedEstimateMover> => {
  const parsedBody = createDesignatedEstimateBodySchema.safeParse(body);
  if (!parsedBody.success) {
    throw new ApiError(
      400,
      '요청 형식이 올바르지 않습니다.',
      API_ERROR_CODE.INVALID_REQUEST
    );
  }

  return requestJson(
    BASE_PATH,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedBody.data),
    },
    designatedEstimateMoverSchema
  );
};
