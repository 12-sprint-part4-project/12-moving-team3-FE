import { MoverProfileForm } from './_components/MoverProfileForm';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '기사님 프로필 등록',
};

const MoverProfilePage = () => {
  return (
    <section className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-white px-6 py-4 md:px-[4.5rem] lg:px-6 lg:py-8">
      <MoverProfileForm />
    </section>
  );
};

export default MoverProfilePage;
