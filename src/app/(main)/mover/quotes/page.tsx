import { createPageMetadata } from '@/i18n/createPageMetadata';
import { resolveTabSearchParam } from '@/lib/resolveTabSearchParam';

import { MoverQuotesTabs } from './_components/MoverQuotesTabs';
import { parseMoverQuotesTabId } from './_lib/parseMoverQuotesTabId';
import MoverQuotesPageClient from './page.client';

export const generateMetadata = createPageMetadata('nav.myQuotes');

export interface MoverQuotesPageProps {
  searchParams: Promise<{ tab?: string | string[] }>;
}

/** `/mover/quotes` 서버 페이지. - 기사 내 견적 관리 페이지. */
const MoverQuotesPage = async ({ searchParams }: MoverQuotesPageProps) => {
  const params = await searchParams;
  const activeTab = parseMoverQuotesTabId(resolveTabSearchParam(params.tab));

  // 탭 바 + 활성 탭 패널
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden">
      {/* 보낸 견적 / 반려 요청 탭 */}
      <MoverQuotesTabs activeTab={activeTab} />
      {/* 활성 탭 패널 */}
      <MoverQuotesPageClient activeTab={activeTab} />
    </div>
  );
};

export default MoverQuotesPage;
