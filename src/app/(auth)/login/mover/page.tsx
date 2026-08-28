import { LoginForm } from '@/app/(auth)/login/_components/LoginForm';
import { createPageMetadata } from '@/i18n/createPageMetadata';
import { resolveTabSearchParam } from '@/lib/resolveTabSearchParam';

export const generateMetadata = createPageMetadata('meta.loginMover');

interface MoverLoginPageProps {
  searchParams: Promise<{ redirect?: string | string[] }>;
}

/** `/login/mover` 서버 페이지. - 기사님 로그인 */
const MoverLoginPage = async ({ searchParams }: MoverLoginPageProps) => {
  const params = await searchParams;
  const redirectTo = resolveTabSearchParam(params.redirect);

  return (
    <section className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-white px-6 py-8 lg:px-0 lg:py-16">
      <LoginForm role="mover" redirectTo={redirectTo} />
    </section>
  );
};

export default MoverLoginPage;
