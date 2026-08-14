import { AUTH_PAGE_SECTION_CLASS } from '@/app/(auth)/_components/authStyles';
import { SignupForm } from '@/app/(auth)/signup/_components/SignupForm';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '기사님 회원가입',
};

const MoverSignupPage = () => {
  return (
    <section className={AUTH_PAGE_SECTION_CLASS}>
      <SignupForm role="mover" />
    </section>
  );
};

export default MoverSignupPage;
