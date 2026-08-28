'use client';

import { useTranslation } from '@/i18n/useTranslation';

import { ReviewsListStatus } from './ReviewsListStatus';

export interface WritableReviewsListStatusProps {
  isPending: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
}

/**
 * `/reviews` 작성 가능 탭 목록 가드 UI.
 * 로딩·에러·empty. 언제 보여줄지는 목록 early return이 담당한다.
 */
export const WritableReviewsListStatus = ({
  isPending,
  isError,
  errorMessage,
  onRetry,
}: WritableReviewsListStatusProps) => {
  const { t } = useTranslation();

  if (isPending) {
    return (
      <ReviewsListStatus
        variant="pending"
        message={t('reviews.writable.loading')}
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

  return <ReviewsListStatus variant="empty" />;
};
