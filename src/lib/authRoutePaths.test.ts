import { describe, expect, it } from 'vitest';

import {
  getAuthRouteRequirement,
  isAuthSharedPath,
  isCustomerOnlyPath,
  isGuestOnlyPath,
  isMoverOnlyPath,
  isPublicPath,
} from './authRoutePaths';

describe('isPublicPath', () => {
  it.each(['/', '/movers', '/movers/1', '/community', '/login', '/auth/kakao'])(
    '%s는 공개 경로이다',
    (pathname) => {
      expect(isPublicPath(pathname)).toBe(true);
    }
  );

  it('/quotes는 공개 경로가 아니다', () => {
    expect(isPublicPath('/quotes')).toBe(false);
  });
});

describe('isGuestOnlyPath', () => {
  it.each(['/login', '/login/mover', '/signup', '/signup/mover'])(
    '%s는 비로그인 전용이다',
    (pathname) => {
      expect(isGuestOnlyPath(pathname)).toBe(true);
    }
  );

  it('/auth는 비로그인 전용이 아니다', () => {
    expect(isGuestOnlyPath('/auth')).toBe(false);
  });
});

describe('역할 전용 경로', () => {
  it('/profile/customer는 고객 전용이다', () => {
    expect(isCustomerOnlyPath('/profile/customer')).toBe(true);
    expect(isMoverOnlyPath('/profile/customer')).toBe(false);
  });

  it('/profile/mover는 기사 전용이다', () => {
    expect(isMoverOnlyPath('/profile/mover')).toBe(true);
    expect(isCustomerOnlyPath('/profile/mover')).toBe(false);
  });

  it('/movers는 기사 전용이 아니다', () => {
    expect(isMoverOnlyPath('/movers')).toBe(false);
  });
});

describe('isAuthSharedPath', () => {
  it.each(['/chat', '/chat/1', '/community/write'])(
    '%s는 로그인만 필요한 공유 경로이다',
    (pathname) => {
      expect(isAuthSharedPath(pathname)).toBe(true);
    }
  );
});

describe('getAuthRouteRequirement', () => {
  it('채팅은 역할 무관 shared이다', () => {
    expect(getAuthRouteRequirement('/chat')).toEqual({ kind: 'shared' });
  });

  it('랜딩은 public이다', () => {
    expect(getAuthRouteRequirement('/')).toEqual({ kind: 'public' });
  });

  it('기사 전용 경로는 MOVER role이다', () => {
    expect(getAuthRouteRequirement('/profile/mover')).toEqual({
      kind: 'role',
      requiredUserType: 'MOVER',
    });
  });

  it('고객 전용 경로는 CUSTOMER role이다', () => {
    expect(getAuthRouteRequirement('/profile/customer')).toEqual({
      kind: 'role',
      requiredUserType: 'CUSTOMER',
    });
  });

  it('분류되지 않은 경로는 public이다', () => {
    expect(getAuthRouteRequirement('/unknown')).toEqual({ kind: 'public' });
  });
});
