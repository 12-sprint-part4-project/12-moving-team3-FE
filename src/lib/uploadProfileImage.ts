import {
  getPresignedUploadUrl,
  uploadToPresignedUrl,
} from '@/services/presignedUploadApi';

const PROFILE_IMAGE_PREFIX = 'profile-images' as const;

const ALLOWED_PROFILE_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

/** 장당 최대 5MB */
export const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

/** 클라이언트 검증 — 실패 시 사용자 메시지, 성공 시 null */
export const validateProfileImageFile = (file: File): string | null => {
  const contentType = file.type || '';

  if (!ALLOWED_PROFILE_IMAGE_TYPES.has(contentType)) {
    return 'JPG, PNG, WEBP 이미지만 업로드할 수 있습니다.';
  }

  if (file.size === 0) {
    return '빈 이미지 파일은 업로드할 수 없습니다.';
  }

  if (file.size > PROFILE_IMAGE_MAX_BYTES) {
    return '이미지는 5MB 이하만 업로드할 수 있습니다.';
  }

  return null;
};

/** Presigned 업로드 후 s3Key 반환 */
export const uploadProfileImage = async (file: Blob): Promise<string> => {
  const contentType = file.type || 'image/jpeg';
  const filename =
    file instanceof File && file.name.trim().length > 0
      ? file.name
      : 'profile.jpg';

  const { data } = await getPresignedUploadUrl({
    filename,
    contentType,
    prefix: PROFILE_IMAGE_PREFIX,
  });

  await uploadToPresignedUrl(data.uploadUrl, file, contentType);

  return data.s3Key;
};
