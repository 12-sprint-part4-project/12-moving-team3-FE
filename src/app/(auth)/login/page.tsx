import type { Metadata } from 'next';

import { LoginForm } from './_components/LoginForm';

export const metadata: Metadata = {
  title: '로그인',
};

/** `/login` 서버 페이지. - 일반 유저 로그인 */
const LoginPage = () => {
  return (
    <section className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-white px-6 py-8 lg:px-0 lg:py-16">
      <LoginForm role="customer" />
    </section>
  );
};

export default LoginPage;
