'use client';

import { useTranslation } from '@/i18n/useTranslation';

import { RequestCardSkeleton } from './RequestCardSkeleton';

const LIST_SKELETON_COUNT = 3;

/** 목록 카드만 — API pending 시 툴바·필터는 유지한 채 사용 */
export const RequestsListSkeleton = ({
  className = '',
}: {
  className?: string;
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={className}
      role="status"
      aria-busy="true"
      aria-label={t('a11y.skeleton.list')}
    >
      <ul className="m-0 flex w-full list-none flex-col gap-6 p-0 lg:gap-12">
        {Array.from({ length: LIST_SKELETON_COUNT }, (_, index) => (
          <li key={index}>
            <RequestCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
};
