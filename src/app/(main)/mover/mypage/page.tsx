import type { Metadata } from 'next';

import { MoverMyPageClient } from './page.client';

export const metadata: Metadata = {
  title: '마이페이지',
};

const MoverMyPage = () => {
  return <MoverMyPageClient />;
};

export default MoverMyPage;
