import { MoverProfileEditForm } from '../_components/MoverProfileEditForm';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '프로필 수정',
};

const MoverProfileEditPage = () => {
  return (
    <section className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-white px-6 pt-4 pb-10 md:px-[4.5rem] lg:px-0 lg:py-6">
      <MoverProfileEditForm />
    </section>
  );
};

export default MoverProfileEditPage;
