import { createPageMetadata } from '@/i18n/createPageMetadata';

import { MoverMyPageClient } from './page.client';

export const generateMetadata = createPageMetadata('nav.profile.mypage');

const MoverMyPage = () => {
  return <MoverMyPageClient />;
};

export default MoverMyPage;
