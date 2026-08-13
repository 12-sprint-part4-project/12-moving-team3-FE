import { API_ERROR_CODE } from '@/constants/errorCode';
import {
  API_BASE_URL,
  ApiError,
  createApiTimeoutSignal,
  throwApiError,
} from '@/lib/apiClient';
import { authFetch } from '@/lib/authFetch';
import type {
  PresignedUploadParams,
  PresignedUploadResponse,
} from '@/types/presignedUpload';

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
    return throwApiError(response);
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
      API_ERROR_CODE.UPLOAD_FAILED
    );
  }
};
