import {
  POST_IMAGE_S3_KEY_PREFIX,
  uploadPostImage,
} from '@/lib/uploadPostImage';

import type { PostImage } from '@/types/community';

const POST_IMAGE_PREFIX = POST_IMAGE_S3_KEY_PREFIX;

export type WriteImageItem =
  | { kind: 'pending'; file: File; previewUrl: string }
  | { kind: 'existing'; s3Key: string; previewUrl: string }
  | { kind: 'unresolved'; previewUrl: string };

const normalizePostImageKey = (
  value: string | null | undefined
): string | null => {
  if (value == null || value.trim() === '') {
    return null;
  }

  const trimmed = value.trim().replace(/^\/+/, '');

  if (trimmed.startsWith(POST_IMAGE_PREFIX)) {
    return trimmed;
  }

  return null;
};

/** view URL → S3 key (공개/CDN URL pathname 기준) */
export const extractPostImageS3KeyFromUrl = (
  imageUrl: string
): string | null => {
  try {
    const url = new URL(imageUrl);
    const pathnameKey = normalizePostImageKey(decodeURIComponent(url.pathname));

    if (pathnameKey !== null) {
      return pathnameKey;
    }

    // path-style: /{bucket}/posts/...
    const segments = decodeURIComponent(url.pathname)
      .split('/')
      .filter((segment) => segment.length > 0);
    const postsIndex = segments.indexOf('posts');

    if (postsIndex >= 0) {
      return normalizePostImageKey(segments.slice(postsIndex).join('/'));
    }
  } catch {
    return null;
  }

  return null;
};

const resolveExistingImageS3Key = (image: PostImage): string | null => {
  const fromKey = normalizePostImageKey(image.imageKey ?? undefined);

  if (fromKey !== null) {
    return fromKey;
  }

  if (image.imageUrl === null) {
    return null;
  }

  return extractPostImageS3KeyFromUrl(image.imageUrl);
};

export const createPendingWriteImageItems = (files: File[]): WriteImageItem[] =>
  files.map((file) => ({
    kind: 'pending',
    file,
    previewUrl: URL.createObjectURL(file),
  }));

export const createExistingWriteImageItems = (
  images: PostImage[]
): WriteImageItem[] => {
  const items: WriteImageItem[] = [];

  for (const image of images) {
    if (image.imageUrl === null) {
      continue;
    }

    const s3Key = resolveExistingImageS3Key(image);

    if (s3Key !== null) {
      items.push({
        kind: 'existing',
        s3Key,
        previewUrl: image.imageUrl,
      });
      continue;
    }

    items.push({
      kind: 'unresolved',
      previewUrl: image.imageUrl,
    });
  }

  return items;
};

export const getWriteImagePreviewUrls = (items: WriteImageItem[]): string[] =>
  items.map((item) => item.previewUrl);

export const hasUnresolvedWriteImageItems = (
  items: WriteImageItem[]
): boolean => items.some((item) => item.kind === 'unresolved');

export const revokePendingWriteImageItems = (items: WriteImageItem[]) => {
  items.forEach((item) => {
    if (item.kind === 'pending') {
      URL.revokeObjectURL(item.previewUrl);
    }
  });
};

export const resolveWriteImageKeys = async (
  items: WriteImageItem[],
  uploadImage: (file: File) => Promise<string> = uploadPostImage
): Promise<string[]> => {
  if (hasUnresolvedWriteImageItems(items)) {
    throw new Error('UNRESOLVED_POST_IMAGES');
  }

  const keys: string[] = [];

  for (const item of items) {
    if (item.kind === 'existing') {
      keys.push(item.s3Key);
      continue;
    }

    if (item.kind === 'pending') {
      keys.push(await uploadImage(item.file));
    }
  }

  return keys;
};
