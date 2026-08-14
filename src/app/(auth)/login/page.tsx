import type { Metadata } from 'next';

import { AUTH_PAGE_SECTION_CLASS } from '@/app/(auth)/_components/authStyles';
import { LoginForm } from '@/app/(auth)/login/_components/LoginForm';

export const metadata: Metadata = {
  title: '로그인',
};

const LoginPage = () => {
  return (
    <section className={AUTH_PAGE_SECTION_CLASS}>
      <LoginForm role="customer" />
    </section>
  );
};

export default LoginPage;
