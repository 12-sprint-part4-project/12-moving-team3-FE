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
  { promptKey: string; linkLabelKey: string }
> = {
  customer: {
    promptKey: 'auth.roleSwitch.moverPrompt',
    linkLabelKey: 'auth.roleSwitch.moverLink',
  },
  mover: {
    promptKey: 'auth.roleSwitch.customerPrompt',
    linkLabelKey: 'auth.roleSwitch.customerLink',
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
