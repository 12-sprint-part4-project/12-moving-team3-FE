import { AUTH_PAGE_SECTION_CLASS } from '@/app/(auth)/_components/authStyles';
import { LoginForm } from '@/app/(auth)/login/_components/LoginForm';
import { resolveTabSearchParam } from '@/lib/resolveTabSearchParam';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인',
};

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string | string[] }>;
}

/** `/login` 서버 페이지. - 일반 유저 로그인 */
const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const params = await searchParams;
  const redirectTo = resolveTabSearchParam(params.redirect);

  return (
    <section className={AUTH_PAGE_SECTION_CLASS}>
      <LoginForm role="customer" redirectTo={redirectTo} />
    </section>
  );
};

export default LoginPage;
