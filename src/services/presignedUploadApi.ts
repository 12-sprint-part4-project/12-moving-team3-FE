import { ApiError } from '@/lib/apiClient';
import {
  API_BASE_URL,
  authFetch,
  createApiTimeoutSignal,
} from '@/services/apiClient.legacy';
import type { ApiErrorBody } from '@/types/api';
import type {
  PresignedUploadParams,
  PresignedUploadResponse,
} from '@/types/presignedUpload';

const parseError = async (response: Response): Promise<never> => {
  const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
  throw new ApiError(
    response.status,
    body?.error?.message ?? '요청 처리 중 오류가 발생했습니다.',
    body?.error?.code ?? 'UNKNOWN_ERROR'
  );
};

/** GET /api/presigned-upload-url */
export const getPresignedUploadUrl = async (
  params: PresignedUploadParams
): Promise<PresignedUploadResponse> => {
  const searchParams = new URLSearchParams({
    filename: params.filename,
    contentType: params.contentType,
    prefix: params.prefix,
  });

  const response = await authFetch(
    `${API_BASE_URL}/api/presigned-upload-url?${searchParams.toString()}`,
    {
      method: 'GET',
      signal: createApiTimeoutSignal(),
    }
  );

  if (!response.ok) {
    return parseError(response);
  }

  return (await response.json()) as PresignedUploadResponse;
};

/** S3 Presigned PUT — Authorization 헤더 없이 호출 */
export const uploadToPresignedUrl = async (
  uploadUrl: string,
  file: Blob,
  contentType: string
): Promise<void> => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
    },
    body: file,
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      '이미지 업로드에 실패했습니다.',
      'UPLOAD_FAILED'
    );
  }
};
