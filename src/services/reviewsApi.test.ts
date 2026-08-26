import { describe, expect, it } from 'vitest';

import { buildReviewPageQuery } from './reviewsApi';

const parseQuery = (query: string): Record<string, string> => {
  const normalized = query.startsWith('?') ? query.slice(1) : query;
  return Object.fromEntries(new URLSearchParams(normalized).entries());
};

describe('buildReviewPageQuery', () => {
  it('파라미터가 없으면 빈 문자열을 반환한다', () => {
    expect(buildReviewPageQuery({})).toBe('');
  });

  it('page와 limit를 쿼리에 포함한다', () => {
    expect(parseQuery(buildReviewPageQuery({ page: 2, limit: 10 }))).toEqual({
      page: '2',
      limit: '10',
    });
  });

  it('page만 있으면 page만 포함한다', () => {
    expect(parseQuery(buildReviewPageQuery({ page: 1 }))).toEqual({
      page: '1',
    });
  });
});
