import { describe, expect, it } from 'vitest';

import { parseReviewsTabId } from './parseReviewsTabId';

describe('parseReviewsTabId', () => {
  it('written이면 written 탭을 반환한다', () => {
    expect(parseReviewsTabId('written')).toBe('written');
  });

  it('그 외 값·null·undefined는 writable 탭을 반환한다', () => {
    expect(parseReviewsTabId('writable')).toBe('writable');
    expect(parseReviewsTabId('unknown')).toBe('writable');
    expect(parseReviewsTabId(null)).toBe('writable');
    expect(parseReviewsTabId(undefined)).toBe('writable');
    expect(parseReviewsTabId('')).toBe('writable');
  });
});
