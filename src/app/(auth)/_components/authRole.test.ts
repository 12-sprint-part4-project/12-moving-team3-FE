import { describe, expect, it } from 'vitest';

import { getAuthRoleSwitch, USER_TYPE_BY_ROLE } from './authRole';

describe('USER_TYPE_BY_ROLE', () => {
  it('고객 역할은 CUSTOMER로 매핑한다', () => {
    expect(USER_TYPE_BY_ROLE.customer).toBe('CUSTOMER');
  });

  it('기사 역할은 MOVER로 매핑한다', () => {
    expect(USER_TYPE_BY_ROLE.mover).toBe('MOVER');
  });
});

describe('getAuthRoleSwitch', () => {
  it('고객 로그인 페이지에서 기사 로그인 경로를 반환한다', () => {
    expect(getAuthRoleSwitch('login', 'customer')).toEqual({
      promptKey: 'auth.roleSwitch.moverPrompt',
      linkLabelKey: 'auth.roleSwitch.moverLink',
      href: '/login/mover',
    });
  });

  it('기사 로그인 페이지에서 고객 로그인 경로를 반환한다', () => {
    expect(getAuthRoleSwitch('login', 'mover')).toEqual({
      promptKey: 'auth.roleSwitch.customerPrompt',
      linkLabelKey: 'auth.roleSwitch.customerLink',
      href: '/login',
    });
  });

  it('고객 회원가입 페이지에서 기사 회원가입 경로를 반환한다', () => {
    expect(getAuthRoleSwitch('signup', 'customer').href).toBe('/signup/mover');
  });

  it('기사 회원가입 페이지에서 고객 회원가입 경로를 반환한다', () => {
    expect(getAuthRoleSwitch('signup', 'mover').href).toBe('/signup');
  });
});
