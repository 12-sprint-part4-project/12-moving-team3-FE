import { ApiError } from '@/lib/apiClient';
import type { ApiErrorBody } from '@/types/api';

const parseErrorBody = (body: unknown): ApiErrorBody | null =>
  body && typeof body === 'object' ? (body as ApiErrorBody) : null;

/**
 * Response JSON 파싱 후 !ok이면 ApiError를 던진다.
 * 성공 시 body를 반환하며, 호출부에서 추가 타입 가드를 할 수 있다.
 */
export const parseMoverApiResponse = async <T = unknown>(
  response: Response,
  fallbackMessage: string
): Promise<T> => {
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody = parseErrorBody(body);
    throw new ApiError(
      response.status,
      errorBody?.error?.message ?? fallbackMessage,
      errorBody?.error?.code ?? 'UNKNOWN_ERROR'
    );
  }

  return body as T;
};
