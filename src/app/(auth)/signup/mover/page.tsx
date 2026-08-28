import { SignupForm } from '@/app/(auth)/signup/_components/SignupForm';

import { createPageMetadata } from '@/i18n/createPageMetadata';

export const generateMetadata = createPageMetadata('meta.signupMover');

/** `/signup/mover` 서버 페이지. - 기사님 회원가입 */
const MoverSignupPage = () => {
  return (
    <section className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-white px-6 py-8 lg:px-0 lg:py-16">
      <SignupForm role="mover" />
    </section>
  );
};

export default MoverSignupPage;
