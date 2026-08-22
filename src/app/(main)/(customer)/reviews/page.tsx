import { parsePositiveInt } from '@/lib/parsePositiveInt';
import { resolveTabSearchParam } from '@/lib/resolveTabSearchParam';

import { ReviewsTabs } from './_components/ReviewsTabs';
import { parseReviewsTabId } from './_lib/parseReviewsTabId';
import ReviewsPageClient from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이사 리뷰',
};

export interface ReviewsPageProps {
  searchParams: Promise<{
    tab?: string | string[];
    highlight?: string | string[];
  }>;
}

/** `/reviews` 서버 페이지. - 작성 가능 / 내가 작성한 리뷰 탭. */
const ReviewsPage = async ({ searchParams }: ReviewsPageProps) => {
  const params = await searchParams;
  const activeTab = parseReviewsTabId(resolveTabSearchParam(params.tab));
  const highlightReviewId = parsePositiveInt(
    resolveTabSearchParam(params.highlight)
  );

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden">
      <ReviewsTabs activeTab={activeTab} />
      <ReviewsPageClient
        activeTab={activeTab}
        highlightReviewId={highlightReviewId}
      />
    </div>
  );
};

export default ReviewsPage;
