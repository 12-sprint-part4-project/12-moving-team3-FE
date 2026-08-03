import { ApiError } from '@/lib/apiClient';
import {
  authFetch,
  createApiTimeoutSignal,
} from '@/services/apiClient.legacy';
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
      errorBody?.error?.code ?? 'UNKNOWN_ERROR'
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
    throw new ApiError(response.status, fallbackMessage, 'INVALID_RESPONSE');
  }

  return body;
};
