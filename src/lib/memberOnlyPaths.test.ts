import { describe, expect, it } from 'vitest';

import { isSuspendedRestrictedPath } from './memberOnlyPaths';

describe('isSuspendedRestrictedPath — favorites·reviews', () => {
  it('/favorites와 하위 경로를 제한한다', () => {
    expect(isSuspendedRestrictedPath('/favorites')).toBe(true);
    expect(isSuspendedRestrictedPath('/favorites/')).toBe(true);
  });

  it('/reviews와 하위 경로를 제한한다', () => {
    expect(isSuspendedRestrictedPath('/reviews')).toBe(true);
    expect(isSuspendedRestrictedPath('/reviews/writable')).toBe(true);
  });

  it('기사 목록 등 비제한 경로는 false를 반환한다', () => {
    expect(isSuspendedRestrictedPath('/movers')).toBe(false);
    expect(isSuspendedRestrictedPath('/movers/abc')).toBe(false);
  });
});
