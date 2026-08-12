import { Suspense } from 'react';

import {
  parseReviewsTabId,
  resolveReviewsTabParam,
  ReviewsTabs,
} from '@/components/reviews/ReviewsTabs';
import { Spinner } from '@/components/ui/Spinner/Spinner';

import { ReviewsPageClient } from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이사 리뷰',
};

export interface ReviewsPageProps {
  searchParams: Promise<{ tab?: string | string[] }>;
}

/** 이사 리뷰 (작성 가능 / 내가 작성한 리뷰) */
const ReviewsPage = async ({ searchParams }: ReviewsPageProps) => {
  const params = await searchParams;
  const activeTab = parseReviewsTabId(resolveReviewsTabParam(params.tab));

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden">
      <ReviewsTabs activeTab={activeTab} />
      <Suspense
        fallback={
          <div className="flex min-h-0 w-full flex-1 items-center justify-center bg-background-200">
            <Spinner message="로딩 중..." />
          </div>
        }
      >
        <ReviewsPageClient />
      </Suspense>
    </div>
  );
};

export default ReviewsPage;
