import { describe, expect, it } from 'vitest';

import {
  commentListResponseSchema,
  commentWithRepliesSchema,
  postDetailSchema,
  postListItemSchema,
  postListResponseSchema,
  postNeighborsResponseSchema,
} from './communitySchema';

const validAuthor = { id: 'user-1', nickname: '작성자' };

const validPostListItem = {
  id: 1,
  category: 'MOVING_TIP',
  region: null,
  title: '제목',
  contentPreview: '내용 미리보기',
  thumbnailUrl: null,
  author: validAuthor,
  likeCount: 0,
  commentCount: 0,
  isLiked: null,
  isCompleted: null,
  createdAt: '2026-08-01T00:00:00.000Z',
};

const validPostDetail = {
  id: 1,
  category: 'MOVING_TIP',
  region: null,
  title: '제목',
  content: '본문',
  images: [],
  author: validAuthor,
  likeCount: 0,
  commentCount: 0,
  isLiked: null,
  isMine: null,
  isCompleted: null,
  createdAt: '2026-08-01T00:00:00.000Z',
  updatedAt: '2026-08-01T00:00:00.000Z',
};

const validCommentItem = {
  id: 1,
  content: '댓글 내용',
  author: validAuthor,
  isMine: null,
  createdAt: '2026-08-01T00:00:00.000Z',
};

// ─────────────────────────────────────────────
// postListItemSchema
// ─────────────────────────────────────────────

describe('postListItemSchema', () => {
  it('유효한 게시글 목록 아이템 통과', () => {
    expect(postListItemSchema.safeParse(validPostListItem).success).toBe(true);
  });

  it('유효한 카테고리 전부 통과', () => {
    const categories = ['MOVING_TIP', 'QUESTION', 'REVIEW', 'ETC', 'FURNITURE_SHARE'];
    for (const category of categories) {
      expect(
        postListItemSchema.safeParse({ ...validPostListItem, category }).success
      ).toBe(true);
    }
  });

  it('유효하지 않은 카테고리 실패', () => {
    expect(
      postListItemSchema.safeParse({ ...validPostListItem, category: 'UNKNOWN' }).success
    ).toBe(false);
  });

  it('isLiked, isCompleted null 허용', () => {
    expect(
      postListItemSchema.safeParse({ ...validPostListItem, isLiked: null, isCompleted: null }).success
    ).toBe(true);
  });

  it('isLiked, isCompleted boolean 허용', () => {
    expect(
      postListItemSchema.safeParse({ ...validPostListItem, isLiked: true, isCompleted: false }).success
    ).toBe(true);
  });

  it('필수 필드 누락 시 실패', () => {
    const { title: _title, ...withoutTitle } = validPostListItem;
    expect(postListItemSchema.safeParse(withoutTitle).success).toBe(false);
  });

  it('author에 id 없으면 실패', () => {
    expect(
      postListItemSchema.safeParse({
        ...validPostListItem,
        author: { nickname: '작성자' },
      }).success
    ).toBe(false);
  });
});

// ─────────────────────────────────────────────
// postDetailSchema
// ─────────────────────────────────────────────

describe('postDetailSchema', () => {
  it('유효한 게시글 상세 통과', () => {
    expect(postDetailSchema.safeParse(validPostDetail).success).toBe(true);
  });

  it('images 배열 항목 유효성 검사', () => {
    expect(
      postDetailSchema.safeParse({
        ...validPostDetail,
        images: [{ imageKey: 'key-1', imageUrl: 'https://cdn.example.com/img.jpg' }],
      }).success
    ).toBe(true);
  });

  it('isMine 필드 없으면 실패', () => {
    const { isMine: _isMine, ...withoutIsMine } = validPostDetail;
    expect(postDetailSchema.safeParse(withoutIsMine).success).toBe(false);
  });
});

// ─────────────────────────────────────────────
// postListResponseSchema
// ─────────────────────────────────────────────

describe('postListResponseSchema', () => {
  it('유효한 목록 응답 통과', () => {
    const response = {
      data: { items: [validPostListItem] },
      meta: { nextCursor: null, hasNextPage: false },
    };
    expect(postListResponseSchema.safeParse(response).success).toBe(true);
  });

  it('빈 items 배열 통과', () => {
    const response = {
      data: { items: [] },
      meta: { nextCursor: null, hasNextPage: false },
    };
    expect(postListResponseSchema.safeParse(response).success).toBe(true);
  });

  it('meta 없으면 실패', () => {
    expect(
      postListResponseSchema.safeParse({ data: { items: [] } }).success
    ).toBe(false);
  });
});

// ─────────────────────────────────────────────
// postNeighborsResponseSchema
// ─────────────────────────────────────────────

describe('postNeighborsResponseSchema', () => {
  it('prev, next 모두 null 허용', () => {
    expect(
      postNeighborsResponseSchema.safeParse({ data: { prev: null, next: null } }).success
    ).toBe(true);
  });

  it('prev, next 값 있을 때 통과', () => {
    expect(
      postNeighborsResponseSchema.safeParse({
        data: {
          prev: { id: 1, title: '이전 글' },
          next: { id: 3, title: '다음 글' },
        },
      }).success
    ).toBe(true);
  });
});

// ─────────────────────────────────────────────
// commentWithRepliesSchema
// ─────────────────────────────────────────────

describe('commentWithRepliesSchema', () => {
  it('대댓글 없는 댓글 통과', () => {
    expect(
      commentWithRepliesSchema.safeParse({ ...validCommentItem, replies: [] }).success
    ).toBe(true);
  });

  it('대댓글 있는 댓글 통과', () => {
    expect(
      commentWithRepliesSchema.safeParse({
        ...validCommentItem,
        replies: [validCommentItem],
      }).success
    ).toBe(true);
  });

  it('replies 필드 없으면 실패', () => {
    expect(commentWithRepliesSchema.safeParse(validCommentItem).success).toBe(false);
  });
});

// ─────────────────────────────────────────────
// commentListResponseSchema
// ─────────────────────────────────────────────

describe('commentListResponseSchema', () => {
  it('유효한 댓글 목록 응답 통과', () => {
    const response = {
      data: { items: [{ ...validCommentItem, replies: [] }] },
      meta: { nextCursor: null, hasNextPage: false },
    };
    expect(commentListResponseSchema.safeParse(response).success).toBe(true);
  });

  it('빈 댓글 목록 통과', () => {
    const response = {
      data: { items: [] },
      meta: { nextCursor: 'cursor-abc', hasNextPage: true },
    };
    expect(commentListResponseSchema.safeParse(response).success).toBe(true);
  });
});
