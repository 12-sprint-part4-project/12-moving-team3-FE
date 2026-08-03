import { Metadata } from 'next';
import { MoverDetailPageClient } from './page.client';

/** 기사님 상세 페이지 */
export const metadata: Metadata = {
  title: '기사님 상세 페이지',
};

const MoverDetailPage = () => {
  return <MoverDetailPageClient />;
};

export default MoverDetailPage;
