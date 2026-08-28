import {
  getPresignedUploadUrl,
  uploadToPresignedUrl,
} from '@/services/presignedUploadApi';

const POST_IMAGE_PREFIX = 'posts' as const;
export const POST_IMAGE_S3_KEY_PREFIX = `${POST_IMAGE_PREFIX}/` as const;

const ALLOWED_POST_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

/** 장당 최대 5MB (BE 계약) */
export const POST_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

/** 클라이언트 검증 — 실패 시 사용자 메시지, 성공 시 null */
export const validatePostImageFile = (file: File): string | null => {
  const contentType = file.type || '';

  if (!ALLOWED_POST_IMAGE_TYPES.has(contentType)) {
    return '지원하지 않는 이미지 형식입니다.';
  }

  if (file.size === 0) {
    return '빈 이미지 파일은 첨부할 수 없어요.';
  }

  if (file.size > POST_IMAGE_MAX_BYTES) {
    return '이미지가 너무 커서 첨부할 수 없어요. (5MB 이하)';
  }

  return null;
};

/** Presigned 업로드 후 s3Key 반환 */
export const uploadPostImage = async (file: File): Promise<string> => {
  const contentType = file.type || 'image/jpeg';
  const filename = file.name.trim().length > 0 ? file.name : 'post-image.jpg';

  const { data } = await getPresignedUploadUrl({
    filename,
    contentType,
    prefix: POST_IMAGE_PREFIX,
  });

  await uploadToPresignedUrl(data.uploadUrl, file, contentType);

  return data.s3Key;
};
