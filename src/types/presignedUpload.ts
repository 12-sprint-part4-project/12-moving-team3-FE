import type { ApiSuccessResponse } from '@/types/api';

export type PresignedUploadPrefix =
  | 'profile-images'
  | 'posts'
  | 'chat-attachments';

export interface PresignedUploadParams {
  filename: string;
  contentType: string;
  prefix: PresignedUploadPrefix;
}

export interface PresignedUploadData {
  uploadUrl: string;
  s3Key: string;
}

export type PresignedUploadResponse = ApiSuccessResponse<PresignedUploadData>;
