import { describe, expect, it } from 'vitest';

import {
  adjustFavoriteCount,
  nextFavoriteCount,
  patchQuoteMover,
} from './favoriteCache';

import type { CustomerQuoteMover } from '@/types/customerQuote';

const createQuoteMover = (
  overrides: Partial<CustomerQuoteMover> = {}
): CustomerQuoteMover => ({
  moverId: 'mover-1',
  name: '김기사',
  profileImage: null,
  shortDescription: '한줄',
  rating: 4.5,
  reviewCount: 10,
  career: 5,
  confirmedQuoteCount: 3,
  favoriteCount: 2,
  isFavorited: false,
  ...overrides,
});

describe('nextFavoriteCount', () => {
  it('찜하면 카운트를 1 올린다', () => {
    expect(nextFavoriteCount(2, true)).toBe(3);
  });

  it('찜 취소하면 카운트를 1 내린다', () => {
    expect(nextFavoriteCount(2, false)).toBe(1);
  });

  it('카운트가 0일 때 취소해도 0 미만으로 내려가지 않는다', () => {
    expect(nextFavoriteCount(0, false)).toBe(0);
  });
});

describe('adjustFavoriteCount', () => {
  it('count가 null·undefined이면 undefined를 반환한다', () => {
    expect(adjustFavoriteCount(null, false, true)).toBeUndefined();
    expect(adjustFavoriteCount(undefined, true, false)).toBeUndefined();
  });

  it('이미 목표 상태면 카운트를 바꾸지 않는다', () => {
    expect(adjustFavoriteCount(5, true, true)).toBe(5);
    expect(adjustFavoriteCount(5, false, false)).toBe(5);
  });

  it('상태가 바뀌면 nextFavoriteCount로 보정한다', () => {
    expect(adjustFavoriteCount(5, false, true)).toBe(6);
    expect(adjustFavoriteCount(5, true, false)).toBe(4);
  });
});

describe('patchQuoteMover', () => {
  it('다른 기사님이면 원본을 그대로 반환한다', () => {
    const mover = createQuoteMover();

    expect(patchQuoteMover(mover, 'other-mover', true)).toBe(mover);
  });

  it('이미 목표 찜 상태면 원본을 그대로 반환한다', () => {
    const mover = createQuoteMover({ isFavorited: true, favoriteCount: 4 });

    expect(patchQuoteMover(mover, 'mover-1', true)).toBe(mover);
  });

  it('찜하면 isFavorited와 favoriteCount를 함께 갱신한다', () => {
    const mover = createQuoteMover({ isFavorited: false, favoriteCount: 2 });

    expect(patchQuoteMover(mover, 'mover-1', true)).toEqual({
      ...mover,
      isFavorited: true,
      favoriteCount: 3,
    });
  });

  it('찜 취소하면 카운트를 내리고 isFavorited를 false로 둔다', () => {
    const mover = createQuoteMover({ isFavorited: true, favoriteCount: 1 });

    expect(patchQuoteMover(mover, 'mover-1', false)).toEqual({
      ...mover,
      isFavorited: false,
      favoriteCount: 0,
    });
  });
});
