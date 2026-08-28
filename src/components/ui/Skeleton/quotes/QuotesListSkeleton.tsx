'use client';

import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import { LIST_SKELETON_COUNT } from './constants';
import { QuoteCardSkeleton } from './QuoteCardSkeleton';

/** 목록 카드만 */
export const QuotesListSkeleton = ({ className }: { className?: string }) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(className)}
      role="status"
      aria-busy="true"
      aria-label={t('a11y.skeleton.list')}
    >
      <ul className="m-0 grid w-full list-none grid-cols-1 gap-6 p-0 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-8">
        {Array.from({ length: LIST_SKELETON_COUNT }, (_, index) => (
          <li key={index}>
            <QuoteCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
};
