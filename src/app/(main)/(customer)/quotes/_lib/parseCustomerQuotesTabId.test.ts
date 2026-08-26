import { describe, expect, it } from 'vitest';

import { parseCustomerQuotesTabId } from './parseCustomerQuotesTabId';

describe('parseCustomerQuotesTabId', () => {
  it('received면 received를 반환한다', () => {
    expect(parseCustomerQuotesTabId('received')).toBe('received');
  });

  it('pending면 pending을 반환한다', () => {
    expect(parseCustomerQuotesTabId('pending')).toBe('pending');
  });

  it('알 수 없는 값·빈 문자열이면 기본값 pending을 반환한다', () => {
    expect(parseCustomerQuotesTabId('sent')).toBe('pending');
    expect(parseCustomerQuotesTabId('')).toBe('pending');
    expect(parseCustomerQuotesTabId('RECEIVED')).toBe('pending');
  });

  it('null·undefined이면 기본값 pending을 반환한다', () => {
    expect(parseCustomerQuotesTabId(null)).toBe('pending');
    expect(parseCustomerQuotesTabId(undefined)).toBe('pending');
  });
});
