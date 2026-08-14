import { cn } from '@/lib/utils';

import { MOVERS_PAGE_X_PADDING } from './_components/moversLayout';
import MoversPageClient from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '기사님 찾기',
};

/** `/movers` 서버 페이지. - 기사님 찾기 타이틀 셸. 필터·목록은 Client. */
const MoversPage = () => (
  // [리팩터][2] 바깥 셸 + 타이틀을 서버로 옮김. Client는 default import.
  <div className="flex w-full flex-col overflow-x-hidden bg-white">
    {/* [리팩터][2][신규] 목록 타이틀. fadeUp 제거(합의). 패딩은 moversLayout. */}
    <div
      className={cn(
        'border-b border-line-100 bg-white py-4 shadow-page-title md:py-6 lg:py-8',
        MOVERS_PAGE_X_PADDING
      )}
    >
      <h1 className="text-2lg-semibold text-black-400 lg:text-2xl-semibold">
        기사님 찾기
      </h1>
    </div>
    <MoversPageClient />
  </div>
);

export default MoversPage;
