import MoverRequestsPageClient from './page.client';
import { parseRequestsListSearchParamsRecord } from './_lib/requestsListSearchParams';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '받은 요청',
};

export interface MoverRequestsPageProps {
  searchParams: Promise<{
    keyword?: string | string[];
    moveTypes?: string | string[];
    scopes?: string | string[];
    sort?: string | string[];
  }>;
}

/**
 * 기사님 받은 요청 페이지.
 */
const MoverRequestsPage = async ({ searchParams }: MoverRequestsPageProps) => {
  const params = await searchParams;
  const initialUrlState = parseRequestsListSearchParamsRecord(params);

  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-white">
      <div className="border-b border-line-100 bg-white px-6 py-4 shadow-page-title md:px-[4.5rem] md:py-6 lg:px-10 lg:py-8 xl:px-16 min-[90rem]:px-[16.25rem]">
        <h1 className="text-2lg-semibold text-black-400 lg:text-2xl-semibold">
          받은 요청
        </h1>
      </div>

      <MoverRequestsPageClient initialUrlState={initialUrlState} />
    </div>
  );
};

export default MoverRequestsPage;
