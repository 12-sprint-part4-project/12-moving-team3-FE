import { LoginForm } from '@/app/(auth)/login/_components/LoginForm';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인',
};

/**
 * 일반유저 로그인 페이지.
 * Figma: Mobile(1:2155) · Tablet(1:2329) · Desktop(1:2051).
 * GNB는 루트 layout의 Header(GnbLanding sm|md|lg)를 재사용한다.
 */
const LoginPage = () => {
  return (
    <section className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-white px-6 py-8 lg:px-0 lg:py-16">
      <LoginForm role="customer" />
    </section>
  );
};

export default LoginPage;
