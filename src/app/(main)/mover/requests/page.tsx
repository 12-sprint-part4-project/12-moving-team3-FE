import { MOVER_REQUESTS_PAGE_X_PADDING } from './_components/moverRequestsStyles';
import { MoverRequestsTitleHeader } from './_components/MoverRequestsTitleHeader';
import {
  DEFAULT_REQUESTS_LIST_URL_STATE,
  parseFocusRequestId,
  parseRequestsListSearchParamsRecord,
} from './_lib/requestsListSearchParams';
import MoverRequestsPageClient from './page.client';

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
    focus?: string | string[];
  }>;
}

/**
 * `/mover/requests` 서버 페이지. - 기사님 받은 요청.
 * `?focus=` 알림 딥링크 시 필터는 기본값으로 열어 대상 카드가 목록에 나올 수 있게 한다.
 */
const MoverRequestsPage = async ({ searchParams }: MoverRequestsPageProps) => {
  const params = await searchParams;
  const focusRequestId = parseFocusRequestId(params.focus);
  const initialUrlState =
    focusRequestId != null
      ? DEFAULT_REQUESTS_LIST_URL_STATE
      : parseRequestsListSearchParamsRecord(params);

  // 타이틀 + 목록 본문
  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-white">
      <MoverRequestsTitleHeader
        title="받은 요청"
        paddingClassName={MOVER_REQUESTS_PAGE_X_PADDING}
      />
      <MoverRequestsPageClient
        initialUrlState={initialUrlState}
        focusRequestId={focusRequestId}
      />
    </div>
  );
};

export default MoverRequestsPage;
