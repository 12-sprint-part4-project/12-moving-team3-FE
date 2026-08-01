import { getAuthSession } from '@/lib/authSession';
import type { ApiErrorBody } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/** API fetch 기본 타임아웃(ms) */
const API_FETCH_TIMEOUT_MS = 10_000;

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

interface ApiClientOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

/**
 * 공용 API 클라이언트.
 * - credentials: include → Refresh Token 쿠키
 * - authSession accessToken 이 있으면 Authorization Bearer 자동 첨부
 */
export const apiClient = async <T>(
  path: string,
  options: ApiClientOptions = {}
): Promise<T> => {
  if (!API_BASE_URL) {
    throw new ApiError(500, 'API 서버 주소가 설정되지 않았습니다.');
  }

  const { body, headers, signal, ...rest } = options;
  const accessToken = getAuthSession()?.accessToken;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    credentials: 'include',
    // 호출측 signal이 있으면 우선, 없으면 기본 타임아웃
    signal: signal ?? AbortSignal.timeout(API_FETCH_TIMEOUT_MS),
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody = payload as ApiErrorBody | null;
    throw new ApiError(
      response.status,
      errorBody?.error?.message ?? '요청에 실패했습니다.',
      errorBody?.error?.code
    );
  }

  return payload as T;
};
