import { LoginForm } from '@/app/(auth)/login/_components/LoginForm';
import { createPageMetadata } from '@/i18n/createPageMetadata';
import { resolveTabSearchParam } from '@/lib/resolveTabSearchParam';

export const generateMetadata = createPageMetadata('common.login');

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string | string[] }>;
}

/** `/login` 서버 페이지. - 일반 유저 로그인 */
const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const params = await searchParams;
  const redirectTo = resolveTabSearchParam(params.redirect);

  return (
    <section className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-white px-6 py-8 lg:px-0 lg:py-16">
      <LoginForm role="customer" redirectTo={redirectTo} />
    </section>
  );
};

export default LoginPage;
