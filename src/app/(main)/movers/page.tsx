import { Metadata } from 'next';
import { MoversPageClient } from './page.client';

/** 기사님 찾기 목록 페이지 */
export const metadata: Metadata = {
  title: '기사님 찾기',
};

const MoversPage = () => {
  return <MoversPageClient />;
};

export default MoversPage;
