import { AUTH_PAGE_SECTION_CLASS } from '@/app/(auth)/_components/authStyles';
import { LoginForm } from '@/app/(auth)/login/_components/LoginForm';
import { resolveTabSearchParam } from '@/lib/resolveTabSearchParam';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '기사님 로그인',
};

interface MoverLoginPageProps {
  searchParams: Promise<{ redirect?: string | string[] }>;
}

/** `/login/mover` 서버 페이지. - 기사님 로그인 */
const MoverLoginPage = async ({ searchParams }: MoverLoginPageProps) => {
  const params = await searchParams;
  const redirectTo = resolveTabSearchParam(params.redirect);

  return (
    <section className={AUTH_PAGE_SECTION_CLASS}>
      <LoginForm role="mover" redirectTo={redirectTo} />
    </section>
  );
};

export default MoverLoginPage;
