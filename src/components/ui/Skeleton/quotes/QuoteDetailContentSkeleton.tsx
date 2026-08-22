'use client';

import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import { DETAIL_PAGE_X_PADDING } from './constants';
import { DetailBodySkeleton } from './DetailBodySkeleton';
import { DetailCtaAsideSkeleton } from './DetailCtaAsideSkeleton';
import { DetailShareAsideSkeleton } from './DetailShareAsideSkeleton';
import { DetailSummaryCardSkeleton } from './DetailSummaryCardSkeleton';

/** 상세 우측 aside 변형 */
export type QuoteDetailAsideVariant = 'cta' | 'share' | 'none';

export interface QuoteDetailContentSkeletonProps {
  className?: string;
  /**
   * 우측 aside 구성
   * - cta: 고객 상세 (확정 CTA + 공유)
   * - share: 기사 보낸 견적 (채팅 + 공유)
   * - none: 반려 등 aside 없음
   */
  aside?: QuoteDetailAsideVariant;
}

const ASIDE_GRID_CLASS: Record<QuoteDetailAsideVariant, string> = {
  cta: 'lg:grid-cols-[minmax(0,59.6875rem)_20.5rem]',
  share: 'lg:grid-cols-[minmax(0,59.6875rem)_auto]',
  none: '',
};

/**
 * 견적 상세 본문 스켈레톤
 */
export const QuoteDetailContentSkeleton = ({
  className,
  aside = 'cta',
}: QuoteDetailContentSkeletonProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'mx-auto grid w-full max-w-[1920px] flex-1 grid-cols-1 gap-6 py-6 md:gap-8 md:py-8 lg:items-start lg:justify-between lg:gap-10 lg:py-10',
        ASIDE_GRID_CLASS[aside],
        DETAIL_PAGE_X_PADDING,
        className
      )}
      role="status"
      aria-busy="true"
      aria-label={t('a11y.skeleton.quoteDetail')}
    >
    <div className="col-start-1 flex w-full max-w-[59.6875rem] flex-col gap-6 md:gap-8 lg:gap-10">
      <DetailSummaryCardSkeleton />
      <DetailBodySkeleton />
    </div>
    {aside === 'cta' ? <DetailCtaAsideSkeleton /> : null}
    {aside === 'share' ? <DetailShareAsideSkeleton /> : null}
  </div>
  );
};
