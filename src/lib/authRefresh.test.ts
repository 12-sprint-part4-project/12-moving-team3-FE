import { describe, expect, it } from 'vitest';

import { isAuthRetryExcludedPath } from './authRefresh';

import { API_PATH } from '@/constants/apiPaths';

describe('isAuthRetryExcludedPath', () => {
  it.each([
    API_PATH.AUTH_REFRESH,
    API_PATH.AUTH_LOGIN,
    API_PATH.AUTH_LOGOUT,
    `https://api.example.com${API_PATH.AUTH_LOGIN}?foo=1`,
    `${API_PATH.AUTH_REFRESH}?retry=1`,
  ])('%s는 401 재시도에서 제외한다', (pathOrUrl) => {
    expect(isAuthRetryExcludedPath(pathOrUrl)).toBe(true);
  });

  it.each([
    API_PATH.AUTH_ME,
    API_PATH.CUSTOMER_PROFILE,
    '/api/users/movers/profile',
  ])(
    '%s는 재시도 대상이다',
    (pathOrUrl) => {
      expect(isAuthRetryExcludedPath(pathOrUrl)).toBe(false);
    }
  );
});
