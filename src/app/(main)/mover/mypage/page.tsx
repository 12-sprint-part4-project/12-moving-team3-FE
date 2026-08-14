import { MoverMyPageClient } from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '마이페이지',
};

const MoverMyPage = () => {
  return <MoverMyPageClient />;
};

export default MoverMyPage;
