import { getChatPresignedUploadUrl } from '@/services/chatApi';
import { uploadToPresignedUrl } from '@/services/presignedUploadApi';

const ALLOWED_CHAT_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

/** 장당 최대 5MB (BE 계약) */
export const CHAT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

/** 메시지당 최대 첨부 수 (BE 계약) */
export const CHAT_IMAGE_MAX_COUNT = 5;

export const CHAT_IMAGE_LIMIT_HINT = `이미지는 최대 ${CHAT_IMAGE_MAX_COUNT}장, 장당 5MB 이하만 첨부할 수 있어요.`;

export const isAllowedChatImageType = (contentType: string): boolean =>
  ALLOWED_CHAT_IMAGE_TYPES.has(contentType);

/** 클라이언트 검증 — 실패 시 사용자 메시지, 성공 시 null */
export const validateChatImageFile = (file: File): string | null => {
  const contentType = file.type || '';
  if (!isAllowedChatImageType(contentType)) {
    return '지원하지 않는 이미지 형식입니다.';
  }
  if (file.size === 0) {
    return '빈 이미지 파일은 업로드할 수 없습니다.';
  }
  if (file.size > CHAT_IMAGE_MAX_BYTES) {
    return '이미지 용량은 5MB 이하만 업로드할 수 있습니다.';
  }
  return null;
};

/** Presigned 업로드 후 IMAGE 메시지용 s3Key 반환 */
export const uploadChatImage = async (file: File): Promise<string> => {
  const contentType = file.type;
  const filename = file.name.trim().length > 0 ? file.name : 'chat-image.jpg';

  const { data } = await getChatPresignedUploadUrl({
    filename,
    contentType,
  });

  await uploadToPresignedUrl(data.uploadUrl, file, contentType);

  return data.s3Key;
};
