import FavoritesPageClient from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '찜한 기사님',
};

/** `/favorites` 서버 페이지. - 찜한 기사님 목록. */
const FavoritesPage = () => <FavoritesPageClient />;

export default FavoritesPage;
