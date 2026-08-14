import type { Metadata } from 'next';

import { AUTH_PAGE_SECTION_CLASS } from '@/app/(auth)/_components/authStyles';
import { LoginForm } from '@/app/(auth)/login/_components/LoginForm';

export const metadata: Metadata = {
  title: '기사님 로그인',
};

const MoverLoginPage = () => {
  return (
    <section className={AUTH_PAGE_SECTION_CLASS}>
      <LoginForm role="mover" />
    </section>
  );
};

export default MoverLoginPage;
