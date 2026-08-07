import {
  getPresignedUploadUrl,
  uploadToPresignedUrl,
} from '@/services/presignedUploadApi';

const POST_IMAGE_PREFIX = 'posts' as const;
export const POST_IMAGE_S3_KEY_PREFIX = `${POST_IMAGE_PREFIX}/` as const;

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
