import { CustomerProfileEditForm } from '../_components/CustomerProfileEditForm';

import { createPageMetadata } from '@/i18n/createPageMetadata';

export const generateMetadata = createPageMetadata('nav.profile.edit');

/** `/profile/customer/edit` 서버 페이지. - 고객 프로필 수정 */
const CustomerProfileEditPage = () => {
  return (
    <section className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-white px-6 py-4 md:px-[4.5rem] lg:px-0 lg:py-6">
      <CustomerProfileEditForm />
    </section>
  );
};

export default CustomerProfileEditPage;
