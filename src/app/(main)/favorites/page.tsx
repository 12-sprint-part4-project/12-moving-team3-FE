import { FavoritesPageClient } from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '찜한 기사님',
};

/** 찜한 기사님 목록 페이지 */
const FavoritesPage = () => {
  return <FavoritesPageClient />;
};

export default FavoritesPage;
