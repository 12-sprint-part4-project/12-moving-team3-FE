import MoverQuoteDetailPageClient from './page.client';
import { MOVER_QUOTES_PAGE_X_PADDING } from '../_components/moverQuotesStyles';
import { MoverQuotesTitleHeader } from '../_components/MoverQuotesTitleHeader';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '견적 상세',
};

export interface MoverQuoteDetailPageProps {
  params: Promise<{ quoteId: string }>;
}

/** `/mover/quotes/[quoteId]` 서버 페이지. - 견적 상세. */
const MoverQuoteDetailPage = async ({ params }: MoverQuoteDetailPageProps) => {
  const { quoteId } = await params;

  // 타이틀 + 상세 본문
  return (
    <div className="flex min-h-full w-full flex-col overflow-x-hidden bg-white">
      <MoverQuotesTitleHeader
        title="견적 상세"
        paddingClassName={MOVER_QUOTES_PAGE_X_PADDING}
      />
      <MoverQuoteDetailPageClient quoteId={quoteId} />
    </div>
  );
};

export default MoverQuoteDetailPage;
