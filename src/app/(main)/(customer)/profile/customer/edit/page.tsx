import { CustomerProfileEditForm } from '../_components/CustomerProfileEditForm';

/**
 * 일반유저 프로필 수정.
 * Figma: Mobile·Tablet(1:8073) → lg 미만, Desktop(1:8146) → lg+.
 */
const CustomerProfileEditPage = () => {
  return (
    <section className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-white px-6 py-4 md:px-[4.5rem] lg:px-0 lg:py-6">
      <CustomerProfileEditForm />
    </section>
  );
};

export default CustomerProfileEditPage;
