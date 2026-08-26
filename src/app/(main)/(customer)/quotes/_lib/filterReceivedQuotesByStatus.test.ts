import { describe, expect, it } from 'vitest';

import { filterReceivedQuotesByStatus } from './filterReceivedQuotesByStatus';

import type { ReceivedQuoteCardModel } from '@/types/customerQuote';

const createReceivedQuote = (
  overrides: Partial<ReceivedQuoteCardModel> = {}
): ReceivedQuoteCardModel => ({
  quoteId: 1,
  moveType: 'home',
  isDesignated: false,
  isConfirmed: false,
  shortDescription: '친절한 기사',
  priceLabel: '₩100,000',
  mover: {
    moverId: '11111111-1111-4111-8111-111111111111',
    name: '김기사',
    profileImageUrl: null,
    shortDescription: '친절한 기사',
    averageRating: 4.5,
    reviewCount: 10,
    career: 5,
    confirmedCount: 3,
    favoriteCount: 2,
    isFavorited: false,
  },
  ...overrides,
});

describe('filterReceivedQuotesByStatus', () => {
  const quotes = [
    createReceivedQuote({ quoteId: 1, isConfirmed: true }),
    createReceivedQuote({ quoteId: 2, isConfirmed: false }),
    createReceivedQuote({ quoteId: 3, isConfirmed: true }),
  ];

  it('ALL이면 전체 목록을 그대로 반환한다', () => {
    expect(filterReceivedQuotesByStatus(quotes, 'ALL')).toEqual(quotes);
  });

  it('CONFIRMED면 확정 견적만 반환한다', () => {
    expect(filterReceivedQuotesByStatus(quotes, 'CONFIRMED')).toEqual([
      quotes[0],
      quotes[2],
    ]);
  });

  it('확정 견적이 없으면 빈 배열을 반환한다', () => {
    expect(
      filterReceivedQuotesByStatus(
        [createReceivedQuote({ isConfirmed: false })],
        'CONFIRMED'
      )
    ).toEqual([]);
  });

  it('빈 목록이면 빈 배열을 반환한다', () => {
    expect(filterReceivedQuotesByStatus([], 'ALL')).toEqual([]);
    expect(filterReceivedQuotesByStatus([], 'CONFIRMED')).toEqual([]);
  });
});
