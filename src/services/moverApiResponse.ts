import { API_ERROR_CODE } from '@/constants/errorCode';
import { ApiError, createApiTimeoutSignal } from '@/lib/apiClient';
import { authFetch } from '@/lib/authFetch';

import type { ApiErrorBody } from '@/types/api';

const parseErrorBody = (body: unknown): ApiErrorBody | null =>
  body && typeof body === 'object' ? (body as ApiErrorBody) : null;

const parseMoverApiResponse = async (
  response: Response,
  fallbackMessage: string
): Promise<unknown> => {
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody = parseErrorBody(body);
    throw new ApiError(
      response.status,
      errorBody?.error?.message ?? fallbackMessage,
      errorBody?.error?.code ?? API_ERROR_CODE.UNKNOWN_ERROR
    );
  }

  return body;
};

/**
 * authFetch + JSON 파싱 + !ok ApiError + 런타임 validator.
 * movers / favorites API 공통 응답 처리.
 */
export const fetchAndValidate = async <T>(
  url: string,
  options: RequestInit,
  validator: (body: unknown) => body is T,
  fallbackMessage: string
): Promise<T> => {
  const response = await authFetch(url, {
    cache: 'no-store',
    ...options,
    signal: options.signal ?? createApiTimeoutSignal(),
  });

  const body = await parseMoverApiResponse(response, fallbackMessage);

  if (!validator(body)) {
    throw new ApiError(
      response.status,
      fallbackMessage,
      API_ERROR_CODE.INVALID_RESPONSE
    );
  }

  return body;
};

/**
 * authFetch + !ok ApiError. 성공 시 본문 없음 (204 등).
 */
export const fetchNoContent = async (
  url: string,
  options: RequestInit,
  fallbackMessage: string
): Promise<void> => {
  const response = await authFetch(url, {
    cache: 'no-store',
    ...options,
    signal: options.signal ?? createApiTimeoutSignal(),
  });

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const errorBody = parseErrorBody(body);
    throw new ApiError(
      response.status,
      errorBody?.error?.message ?? fallbackMessage,
      errorBody?.error?.code ?? API_ERROR_CODE.UNKNOWN_ERROR
    );
  }
};
