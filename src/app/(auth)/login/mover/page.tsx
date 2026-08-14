import type { Metadata } from 'next';

import { LoginForm } from '../_components/LoginForm';

export const metadata: Metadata = {
  title: '기사님 로그인',
};

/** `/login/mover` 서버 페이지. - 기사님 로그인 */
const MoverLoginPage = () => {
  return (
    <section className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-white px-6 py-8 lg:px-0 lg:py-16">
      <LoginForm role="mover" />
    </section>
  );
};

export default MoverLoginPage;
