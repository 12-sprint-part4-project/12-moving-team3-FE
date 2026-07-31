import { CustomerSignupForm } from '@/app/(auth)/signup/_components/CustomerSignupForm';

/**
 * 일반유저 회원가입 페이지.
 * Figma: Tablet(1:2608) · Desktop(1:2756).
 * GNB는 루트 layout의 Header(GnbLanding sm|md|lg)를 재사용한다.
 */
const SignupPage = () => {
  return (
    <section className="flex min-h-full flex-col items-center bg-white px-6 py-8 md:py-10 lg:px-0 lg:py-16">
      <CustomerSignupForm />
    </section>
  );
};

export default SignupPage;
