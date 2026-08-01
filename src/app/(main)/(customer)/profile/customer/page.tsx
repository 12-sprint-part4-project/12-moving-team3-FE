import { CustomerProfileForm } from './_components/CustomerProfileForm';

const CustomerProfilePage = () => {
  return (
    <section className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-white px-6 py-6 lg:px-0 lg:py-6">
      <CustomerProfileForm />
    </section>
  );
};

export default CustomerProfilePage;
