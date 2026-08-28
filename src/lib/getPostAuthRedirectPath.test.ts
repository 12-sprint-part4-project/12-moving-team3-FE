import { describe, expect, it } from 'vitest';

import {
  getPostAuthRedirectPath,
  getSafeRedirectPath,
} from './getPostAuthRedirectPath';

import type { AuthUser } from '@/types/auth';

const createUser = (overrides: Partial<AuthUser> = {}): AuthUser => ({
  id: 'user-1',
  userType: 'CUSTOMER',
  nickname: '닉네임',
  email: 'user@example.com',
  phoneNumber: '',
  isProfileCompleted: true,
  status: 'ACTIVE',
  ...overrides,
});

describe('getSafeRedirectPath', () => {
  it('빈 값이면 null을 반환한다', () => {
    expect(getSafeRedirectPath(null)).toBeNull();
    expect(getSafeRedirectPath(undefined)).toBeNull();
    expect(getSafeRedirectPath('')).toBeNull();
  });

  it('프로토콜 상대 경로와 외부 URL은 거부한다', () => {
    expect(getSafeRedirectPath('//evil.com')).toBeNull();
    expect(getSafeRedirectPath('https://evil.com')).toBeNull();
  });

  it('앱 내부 상대 경로는 허용한다', () => {
    expect(getSafeRedirectPath('/quotes')).toBe('/quotes');
  });
});

describe('getPostAuthRedirectPath', () => {
  it('프로필 미등록 고객은 고객 프로필 등록으로 보낸다', () => {
    expect(
      getPostAuthRedirectPath(
        createUser({ userType: 'CUSTOMER', isProfileCompleted: false })
      )
    ).toBe('/profile/customer');
  });

  it('프로필 미등록 기사는 기사 프로필 등록으로 보낸다', () => {
    expect(
      getPostAuthRedirectPath(
        createUser({ userType: 'MOVER', isProfileCompleted: false })
      )
    ).toBe('/profile/mover');
  });

  it('프로필이 있으면 안전한 redirect 쿼리를 따른다', () => {
    expect(
      getPostAuthRedirectPath(createUser(), { redirectTo: '/quotes' })
    ).toBe('/quotes');
  });

  it('redirect가 없으면 홈으로 보낸다', () => {
    expect(getPostAuthRedirectPath(createUser())).toBe('/');
  });

  it('프로필 미등록이면 redirect 쿼리보다 프로필 등록을 우선한다', () => {
    expect(
      getPostAuthRedirectPath(
        createUser({ isProfileCompleted: false }),
        { redirectTo: '/quotes' }
      )
    ).toBe('/profile/customer');
  });
});
