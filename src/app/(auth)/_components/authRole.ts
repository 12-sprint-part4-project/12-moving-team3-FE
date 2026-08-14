import {
  LOGIN_HREF_BY_USER_TYPE,
  SIGNUP_HREF_BY_USER_TYPE,
} from '@/lib/authRoutePaths';

import type { ApiUserType } from '@/types/auth';

export type AuthRole = 'customer' | 'mover';
export type AuthPage = 'login' | 'signup';

export const USER_TYPE_BY_ROLE: Record<AuthRole, ApiUserType> = {
  customer: 'CUSTOMER',
  mover: 'MOVER',
};

const AUTH_ROLE_SWITCH_COPY: Record<
  AuthRole,
  { prompt: string; linkLabel: string }
> = {
  customer: {
    prompt: '기사님이신가요?',
    linkLabel: '기사님 전용 페이지',
  },
  mover: {
    prompt: '일반 유저라면?',
    linkLabel: '일반 유저 전용 페이지',
  },
};

const getOppositeAuthRole = (role: AuthRole): AuthRole =>
  role === 'customer' ? 'mover' : 'customer';

/** 같은 기능(로그인/회원가입)의 반대 역할 페이지 */
export const getAuthRoleSwitch = (page: AuthPage, role: AuthRole) => {
  const oppositeUserType = USER_TYPE_BY_ROLE[getOppositeAuthRole(role)];
  const href =
    page === 'login'
      ? LOGIN_HREF_BY_USER_TYPE[oppositeUserType]
      : SIGNUP_HREF_BY_USER_TYPE[oppositeUserType];

  return {
    ...AUTH_ROLE_SWITCH_COPY[role],
    href,
  };
};
