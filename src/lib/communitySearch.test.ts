import { describe, expect, it } from 'vitest';

import { getCommunitySearchKeyword } from './communitySearch';

describe('getCommunitySearchKeyword', () => {
  it('빈 문자열이면 undefined 반환', () => {
    expect(getCommunitySearchKeyword('')).toBeUndefined();
  });

  it('공백만 있으면 undefined 반환', () => {
    expect(getCommunitySearchKeyword('   ')).toBeUndefined();
  });

  it('키워드가 있으면 trim한 값 반환', () => {
    expect(getCommunitySearchKeyword('이사')).toBe('이사');
    expect(getCommunitySearchKeyword('  이사  ')).toBe('이사');
  });
});
