import { ReviewsPageClient } from './page.client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이사 리뷰',
};

/** 이사 리뷰 (작성 가능 / 내가 작성한 리뷰) */
const ReviewsPage = () => {
  return <ReviewsPageClient />;
};

export default ReviewsPage;
