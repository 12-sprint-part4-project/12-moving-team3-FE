import { describe, expect, it } from 'vitest';

import { parseMoverQuotesTabId } from './parseMoverQuotesTabId';

describe('parseMoverQuotesTabId', () => {
  it('rejected면 rejected를 반환한다', () => {
    expect(parseMoverQuotesTabId('rejected')).toBe('rejected');
  });

  it('sent면 sent를 반환한다', () => {
    expect(parseMoverQuotesTabId('sent')).toBe('sent');
  });

  it('알 수 없는 값·빈 문자열이면 기본값 sent를 반환한다', () => {
    expect(parseMoverQuotesTabId('pending')).toBe('sent');
    expect(parseMoverQuotesTabId('')).toBe('sent');
    expect(parseMoverQuotesTabId('REJECTED')).toBe('sent');
  });

  it('null·undefined이면 기본값 sent를 반환한다', () => {
    expect(parseMoverQuotesTabId(null)).toBe('sent');
    expect(parseMoverQuotesTabId(undefined)).toBe('sent');
  });
});
