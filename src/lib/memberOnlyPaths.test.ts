import { describe, expect, it } from 'vitest';

import { isSuspendedRestrictedPath } from './memberOnlyPaths';

describe('isSuspendedRestrictedPath', () => {
  it.each([
    '/favorites',
    '/reviews/1',
    '/estimates/request',
    '/quotes',
    '/mover/requests',
    '/mover/quotes/1',
    '/community/write',
    '/chat/room-1',
  ])('%s는 정지 계정의 제한 경로이다', (pathname) => {
    expect(isSuspendedRestrictedPath(pathname)).toBe(true);
  });

  it.each(['/', '/chat', '/profile/customer', '/profile/mover', '/community'])(
    '%s는 정지 계정에도 허용한다',
    (pathname) => {
      expect(isSuspendedRestrictedPath(pathname)).toBe(false);
    }
  );
});
