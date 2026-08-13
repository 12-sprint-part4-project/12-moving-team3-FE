import type { Metadata } from 'next';

import { CustomerProfileForm } from './_components/CustomerProfileForm';

export const metadata: Metadata = {
  title: '프로필 등록',
};

const CustomerProfilePage = () => {
  return (
    <section className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-white px-6 py-4 md:px-[4.5rem] lg:px-0 lg:py-6">
      <CustomerProfileForm />
    </section>
  );
};

export default CustomerProfilePage;
