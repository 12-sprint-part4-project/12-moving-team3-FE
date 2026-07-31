import { SignupForm } from '@/app/(auth)/signup/_components/SignupForm';

/**
 * 일반유저 회원가입 페이지.
 * Figma: Mobile(1:2900) · Tablet(1:2608) · Desktop(1:2756).
 * GNB는 루트 layout의 Header(GnbLanding sm|md|lg)를 재사용한다.
 */
const SignupPage = () => {
  return (
    <section className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-white px-6 py-8 lg:px-0 lg:py-16">
      <SignupForm role="customer" />
    </section>
  );
};

export default SignupPage;
