import { cookies } from 'next/headers';

import {
  AUTH_UI_COOKIE_NAME,
  parseAuthUiUser,
  type AuthUiUser,
} from '@/lib/authUiCookie';

/** Server Component에서 헤더 SSR용 로그인 유저 힌트를 읽는다. */
export const getServerAuthUiUser = async (): Promise<AuthUiUser | null> => {
  const cookieStore = await cookies();
  return parseAuthUiUser(cookieStore.get(AUTH_UI_COOKIE_NAME)?.value);
};
