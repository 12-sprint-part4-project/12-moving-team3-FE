import { createPageMetadata } from '@/i18n/createPageMetadata';
import { getServerTranslation } from '@/i18n/getServerTranslation';

import { MOVER_REQUESTS_PAGE_X_PADDING } from './_components/moverRequestsStyles';
import { MoverRequestsTitleHeader } from './_components/MoverRequestsTitleHeader';
import {
  DEFAULT_REQUESTS_LIST_URL_STATE,
  parseFocusRequestId,
  parseRequestsListSearchParamsRecord,
} from './_lib/requestsListSearchParams';
import MoverRequestsPageClient from './page.client';

export const generateMetadata = createPageMetadata('nav.receivedRequests');

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
  const { t } = await getServerTranslation();
  const params = await searchParams;
  const focusRequestId = parseFocusRequestId(params.focus);
  const initialUrlState =
    focusRequestId != null
      ? DEFAULT_REQUESTS_LIST_URL_STATE
      : parseRequestsListSearchParamsRecord(params);

  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-white">
      <MoverRequestsTitleHeader
        title={t('nav.receivedRequests')}
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
