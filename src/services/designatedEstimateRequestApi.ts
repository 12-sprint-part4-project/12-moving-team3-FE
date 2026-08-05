import {
  API_BASE_URL,
  ApiError,
  DEFAULT_API_ERROR_MESSAGE,
  throwApiError,
} from '@/lib/apiClient';
import { authFetch } from '@/lib/authFetch';
import {
  createDesignatedEstimateBodySchema,
  designatedEstimateMoverSchema,
  type CreateDesignatedEstimateBody,
  type DesignatedEstimateMover,
} from '@/lib/designatedEstimateRequestSchema';

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
    return new ApiError(408, '요청 시간이 초과되었습니다.', 'TIMEOUT');
  }

  return new ApiError(0, '네트워크 오류가 발생했습니다.', 'NETWORK_ERROR');
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
      'INVALID_REQUEST'
    );
  }

  let response: Response;

  try {
    response = await authFetch(`${API_BASE_URL}${BASE_PATH}`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedBody.data),
    });
  } catch (error) {
    throw toNetworkApiError(error);
  }

  if (!response.ok) {
    return throwApiError(response);
  }

  try {
    const json: unknown = await response.json();
    if (!json || typeof json !== 'object' || !('data' in json)) {
      throw new ApiError(500, DEFAULT_API_ERROR_MESSAGE, 'INVALID_RESPONSE');
    }

    const result = designatedEstimateMoverSchema.safeParse(
      (json as { data: unknown }).data
    );
    if (!result.success) {
      throw new ApiError(500, DEFAULT_API_ERROR_MESSAGE, 'INVALID_RESPONSE');
    }

    return result.data;
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
      'INVALID_RESPONSE'
    );
  }
};
