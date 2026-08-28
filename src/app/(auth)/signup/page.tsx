import { SignupForm } from '@/app/(auth)/signup/_components/SignupForm';

import { createPageMetadata } from '@/i18n/createPageMetadata';

export const generateMetadata = createPageMetadata('meta.signup');

/** `/signup` 서버 페이지. - 일반 유저 회원가입 */
const SignupPage = () => {
  return (
    <section className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-white px-6 py-8 lg:px-0 lg:py-16">
      <SignupForm role="customer" />
    </section>
  );
};

export default SignupPage;
