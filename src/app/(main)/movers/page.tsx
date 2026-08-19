import { cn } from '@/lib/utils';

import { MOVERS_PAGE_X_PADDING } from './_components/moversLayout';
import MoversPageClient from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '기사님 찾기',
};

/** `/movers` 서버 페이지. - 기사님 찾기 타이틀 셸. 필터·목록은 Client. */
const MoversPage = () => (
  <div className="flex w-full flex-col overflow-x-hidden bg-white">
    <div
      className={cn(
        'border-b border-line-100 bg-white py-4 shadow-page-title tablet:py-6 xl:py-8',
        MOVERS_PAGE_X_PADDING
      )}
    >
      <h1 className="text-2lg-semibold text-black-400 xl:text-2xl-semibold">
        기사님 찾기
      </h1>
    </div>
    <MoversPageClient />
  </div>
);

export default MoversPage;
