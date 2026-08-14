import { AUTH_PAGE_SECTION_CLASS } from '@/app/(auth)/_components/authStyles';
import { SignupForm } from '@/app/(auth)/signup/_components/SignupForm';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회원가입',
};

const SignupPage = () => {
  return (
    <section className={AUTH_PAGE_SECTION_CLASS}>
      <SignupForm role="customer" />
    </section>
  );
};

export default SignupPage;
