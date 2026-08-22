import { createPageMetadata } from '@/i18n/createPageMetadata';

import FavoritesPageClient from './page.client';

export const generateMetadata = createPageMetadata('nav.profile.favorites');

/** `/favorites` 서버 페이지. - 찜한 기사님 목록. */
const FavoritesPage = () => <FavoritesPageClient />;

export default FavoritesPage;
