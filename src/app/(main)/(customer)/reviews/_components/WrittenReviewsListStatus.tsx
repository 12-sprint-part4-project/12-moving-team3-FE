'use client';

import { useTranslation } from '@/i18n/useTranslation';

import { ReviewsListStatus } from './ReviewsListStatus';

export interface WrittenReviewsListStatusProps {
  isPending: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
}

/**
 * `/reviews` 내가 작성한 리뷰 탭 목록 가드 UI.
 * 로딩·에러·empty. 언제 보여줄지는 패널 early return이 담당한다.
 */
export const WrittenReviewsListStatus = ({
  isPending,
  isError,
  errorMessage,
  onRetry,
}: WrittenReviewsListStatusProps) => {
  const { t } = useTranslation();

  if (isPending) {
    return (
      <ReviewsListStatus
        variant="pending"
        message={t('reviews.written.loading')}
      />
    );
  }

  if (isError) {
    return (
      <ReviewsListStatus
        variant="error"
        message={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  return (
    <ReviewsListStatus
      variant="empty"
      message={t('reviews.written.empty')}
    />
  );
};

