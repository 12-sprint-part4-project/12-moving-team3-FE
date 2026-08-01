import { LoginForm } from '@/app/(auth)/login/_components/LoginForm';

/**
 * 기사님 로그인 페이지.
 * 일반유저와 동일 폼이며 role만 mover로 전달한다.
 */
const MoverLoginPage = () => {
  return (
    <section className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-white px-6 py-8 lg:px-0 lg:py-16">
      <LoginForm role="mover" />
    </section>
  );
};

export default MoverLoginPage;
