import {
  getPresignedUploadUrl,
  uploadToPresignedUrl,
} from '@/services/presignedUploadApi';

const PROFILE_IMAGE_PREFIX = 'profile-images' as const;

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
