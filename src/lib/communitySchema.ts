import { z } from 'zod';

import { REGION_CHIP_OPTIONS } from '@/constants/commonOptions';

const REGION_VALUES = REGION_CHIP_OPTIONS.map((o) => o.value);

export const postCategorySchema = z.enum([
  'MOVING_TIP',
  'QUESTION',
  'REVIEW',
  'ETC',
  'FURNITURE_SHARE',
]);

export const regionSchema = z.enum(REGION_VALUES);

const postAuthorSchema = z.object({
  id: z.string(),
  nickname: z.string(),
  profileImageUrl: z.string().nullable(),
});

export const postListItemSchema = z.object({
  id: z.number(),
  category: postCategorySchema,
  region: regionSchema.nullable(),
  title: z.string(),
  contentPreview: z.string(),
  thumbnailUrl: z.string().nullable(),
  author: postAuthorSchema,
  likeCount: z.number(),
  commentCount: z.number(),
  isLiked: z.boolean().nullable(),
  isCompleted: z.boolean().nullable(),
  createdAt: z.string(),
});

const postImageSchema = z.object({
  imageKey: z.string().nullable(),
  imageUrl: z.string().nullable(),
});

export const postDetailSchema = z.object({
  id: z.number(),
  category: postCategorySchema,
  region: regionSchema.nullable(),
  title: z.string(),
  content: z.string(),
  images: z.array(postImageSchema),
  author: postAuthorSchema,
  likeCount: z.number(),
  commentCount: z.number(),
  isLiked: z.boolean().nullable(),
  isMine: z.boolean().nullable(),
  isCompleted: z.boolean().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const cursorMetaSchema = z.object({
  nextCursor: z.string().nullable(),
  hasNextPage: z.boolean(),
});

export const postListResponseSchema = z.object({
  data: z.object({ items: z.array(postListItemSchema) }),
  meta: cursorMetaSchema,
});

export const postDetailResponseSchema = z.object({
  data: postDetailSchema,
});

export const postIdResponseSchema = z.object({
  data: z.object({ id: z.number() }),
});

export const postNeighborsResponseSchema = z.object({
  data: z.object({
    prev: z.object({ id: z.number(), title: z.string() }).nullable(),
    next: z.object({ id: z.number(), title: z.string() }).nullable(),
  }),
});

const commentItemSchema = z.object({
  id: z.number(),
  content: z.string(),
  author: postAuthorSchema,
  isMine: z.boolean().nullable(),
  createdAt: z.string(),
});

export const commentWithRepliesSchema = commentItemSchema.extend({
  replies: z.array(commentItemSchema),
});

export const commentListResponseSchema = z.object({
  data: z.object({ items: z.array(commentWithRepliesSchema) }),
  meta: cursorMetaSchema,
});

export const postLikeResponseSchema = z.object({
  data: z.null(),
});
