import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { API_ERROR_CODE } from '@/constants/errorCode';
import { ApiError } from '@/lib/apiClient';
import { getAuthSession } from '@/lib/authSession';

import { assertMoverAccessToken, getMoverAccessToken } from './moversAuth';

vi.mock('@/lib/authSession', () => ({
  getAuthSession: vi.fn(),
}));

describe('getMoverAccessToken', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.mocked(getAuthSession).mockReset();
  });

  it('window가 없으면 null을 반환한다', () => {
    vi.stubGlobal('window', undefined);

    expect(getMoverAccessToken()).toBeNull();
  });

  it('세션에 accessToken이 있으면 토큰을 반환한다', () => {
    vi.stubGlobal('window', {});
    vi.mocked(getAuthSession).mockReturnValue({ accessToken: 'access-token' });

    expect(getMoverAccessToken()).toBe('access-token');
  });

  it('세션이 없으면 null을 반환한다', () => {
    vi.stubGlobal('window', {});
    vi.mocked(getAuthSession).mockReturnValue(null);

    expect(getMoverAccessToken()).toBeNull();
  });
});

describe('assertMoverAccessToken', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.mocked(getAuthSession).mockReset();
  });

  it('토큰이 있으면 통과한다', () => {
    vi.mocked(getAuthSession).mockReturnValue({ accessToken: 'access-token' });

    expect(() => assertMoverAccessToken()).not.toThrow();
  });

  it('토큰이 없으면 UNAUTHORIZED ApiError를 던진다', () => {
    vi.mocked(getAuthSession).mockReturnValue(null);

    try {
      assertMoverAccessToken();
      expect.unreachable('should throw');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({
        status: 401,
        message: '로그인이 필요한 기능입니다.',
        code: API_ERROR_CODE.UNAUTHORIZED,
      });
    }
  });
});
