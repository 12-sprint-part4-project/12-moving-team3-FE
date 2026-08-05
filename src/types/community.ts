import type { RegionChipValue } from '@/constants/commonOptions';
import type { ApiSuccessResponse } from '@/types/api';

export type PostCategory =
  'MOVING_TIP' | 'QUESTION' | 'REVIEW' | 'ETC' | 'FURNITURE_SHARE';

export type PostSort = 'LATEST' | 'POPULAR' | 'MOST_COMMENTED';

export type Region = RegionChipValue;

export interface PostAuthor {
  id: string;
  nickname: string;
  profileImageUrl: string | null;
}

export interface PostListItem {
  id: number;
  category: PostCategory;
  region: Region | null;
  title: string;
  contentPreview: string;
  thumbnailUrl: string | null;
  author: PostAuthor;
  likeCount: number;
  commentCount: number;
  isLiked: boolean | null;
  isCompleted: boolean | null;
  createdAt: string;
}

export interface PostDetail {
  id: number;
  category: PostCategory;
  region: Region | null;
  title: string;
  content: string;
  images: { imageUrl: string | null }[];
  author: PostAuthor;
  likeCount: number;
  commentCount: number;
  isLiked: boolean | null;
  isCompleted: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostListMeta {
  nextCursor: string | null;
  hasNextPage: boolean;
}

export type CommentListMeta = PostListMeta;

export interface PostListResponse
  extends ApiSuccessResponse<{ items: PostListItem[] }, PostListMeta> {
  meta: PostListMeta;
}

export type PostDetailResponse = ApiSuccessResponse<PostDetail>;

export type PostIdResponse = ApiSuccessResponse<{ id: number }>;

export interface PostListQuery {
  category?: PostCategory;
  region?: Region;
  sort?: PostSort;
  keyword?: string;
  cursor?: string;
  limit?: number;
}

/** 목록 조회 파라미터 (cursor 제외) */
export type PostListParams = Omit<PostListQuery, 'cursor'>;

export interface CreatePostBody {
  category: PostCategory;
  region?: Region;
  title: string;
  content: string;
  imageKeys?: string[];
  latitude?: number;
  longitude?: number;
}

export interface UpdatePostBody {
  content?: string;
  imageKeys?: string[];
}

export interface CommentItem {
  id: number;
  content: string;
  author: PostAuthor;
  isMine: boolean | null;
  createdAt: string;
}

export interface CommentWithReplies extends CommentItem {
  replies: CommentItem[];
}

export interface CommentListResponse
  extends ApiSuccessResponse<{ items: CommentWithReplies[] }, CommentListMeta> {
  meta: CommentListMeta;
}

export interface CommentListQuery {
  cursor?: string;
  limit?: number;
}

/** 댓글 목록 조회 파라미터 (cursor 제외) */
export interface CommentListParams {
  limit?: number;
}

export interface CreateCommentBody {
  content: string;
}

export interface CreateReplyBody extends CreateCommentBody {
  commentId: number;
}

export interface PostLikeResponse extends ApiSuccessResponse<null> {
  data: null;
}
