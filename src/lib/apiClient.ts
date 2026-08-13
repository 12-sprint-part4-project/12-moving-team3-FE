import { API_ERROR_CODE } from '@/constants/errorCode';
import { getAuthSession } from '@/lib/authSession';
import type { ApiErrorBody } from '@/types/api';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

/** API fetch 기본 타임아웃(ms) */
export const API_FETCH_TIMEOUT_MS = 10_000;

/** API 실패 시 기본 메시지·코드 */
export const DEFAULT_API_ERROR_MESSAGE = '요청 처리 중 오류가 발생했습니다.';
export const DEFAULT_API_ERROR_CODE = API_ERROR_CODE.UNKNOWN_ERROR;

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

/** 기본 타임아웃용 AbortSignal */
export const createApiTimeoutSignal = (
  timeoutMs: number = API_FETCH_TIMEOUT_MS
): AbortSignal => AbortSignal.timeout(timeoutMs);

/** 원본 signal과 타임아웃 signal을 병합 */
export const mergeAbortSignals = (
  ...signals: Array<AbortSignal | null | undefined>
): AbortSignal | undefined => {
  const activeSignals = signals.filter(
    (signal): signal is AbortSignal => signal != null
  );

  if (activeSignals.length === 0) {
    return undefined;
  }
  if (activeSignals.length === 1) {
    return activeSignals[0];
  }
  if (typeof AbortSignal.any === 'function') {
    return AbortSignal.any(activeSignals);
  }

  return activeSignals[0];
};

/** authSession에 저장된 Access Token */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return getAuthSession()?.accessToken ?? null;
};

/** 네트워크·타임아웃 예외를 ApiError로 정규화 */
export const toNetworkApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  const errorName =
    error instanceof DOMException || error instanceof Error
      ? error.name
      : undefined;
  const isTimeout = errorName === 'TimeoutError' || errorName === 'AbortError';

  if (isTimeout) {
    return new ApiError(
      408,
      '요청 시간이 초과되었습니다.',
      API_ERROR_CODE.TIMEOUT
    );
  }

  return new ApiError(
    0,
    '네트워크 오류가 발생했습니다.',
    API_ERROR_CODE.NETWORK_ERROR
  );
};

/** API·일반 Error에서 사용자 메시지 추출 (React Query error.message 호환) */
export const resolveApiErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return fallback;
};

/** 실패 응답을 ApiError로 변환 후 throw */
export const throwApiError = async (response: Response): Promise<never> => {
  const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
  throw new ApiError(
    response.status,
    body?.error?.message ?? DEFAULT_API_ERROR_MESSAGE,
    body?.error?.code ?? DEFAULT_API_ERROR_CODE
  );
};

interface ApiClientOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

/** credentials: include → Refresh Token 쿠키 전달 */
export const apiClient = async <T>(
  path: string,
  options: ApiClientOptions = {}
): Promise<T> => {
  const { body, headers, signal, ...rest } = options;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      credentials: 'include',
      signal: mergeAbortSignals(signal, createApiTimeoutSignal()),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    throw toNetworkApiError(error);
  }

  if (!response.ok) {
    return throwApiError(response);
  }

  return (await response.json().catch(() => null)) as T;
};
