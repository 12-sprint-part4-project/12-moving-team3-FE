import { cn } from '@/lib/utils';

import { FAVORITES_PAGE_X_PADDING } from './_components/favoritesLayout';
import FavoritesPageClient from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '찜한 기사님',
};

/** `/favorites` 서버 페이지. - 찜한 기사님 타이틀 셸. 목록은 Client. */
const FavoritesPage = () => (
  <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden">
    <div
      className={cn(
        'shrink-0 border-b border-line-100 bg-white py-4 shadow-page-title md:py-6 lg:py-8',
        FAVORITES_PAGE_X_PADDING
      )}
    >
      <h1 className="text-2lg-semibold text-black-400 lg:text-2xl-semibold">
        찜한 기사님
      </h1>
    </div>
    <FavoritesPageClient />
  </div>
);

export default FavoritesPage;
