import type { ApiErrorBody } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

/** credentials: include → Refresh Token 쿠키 전달 */
export const apiClient = async <T>(
  path: string,
  options: ApiClientOptions = {}
): Promise<T> => {
  if (!API_BASE_URL) {
    throw new ApiError(500, 'API 서버 주소가 설정되지 않았습니다.');
  }

  const { body, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
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
