import { CustomerProfileForm } from './_components/CustomerProfileForm';

/**
 * 일반유저 프로필 등록.
 * Figma: Mobile(1:10000)·Tablet(1:9798) → lg 미만, Desktop(1:9898) → lg+.
 */
const CustomerProfilePage = () => {
  return (
    <section className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-white px-6 py-4 md:px-[4.5rem] lg:px-0 lg:py-6">
      <CustomerProfileForm />
    </section>
  );
};

export default CustomerProfilePage;
