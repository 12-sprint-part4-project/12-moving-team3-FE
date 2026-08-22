'use client';

import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import { MOVERS_DETAIL_SKELETON_CLASS } from './constants';
import { MoverCardSkeleton } from './MoverCardSkeleton';

const PULSE = 'animate-pulse bg-background-200 motion-reduce:animate-none';

const DetailSectionSkeleton = () => (
  <section className="flex flex-col gap-4 border-b border-line-100 py-6 xl:gap-8 xl:py-10">
    <div className={cn(PULSE, 'h-6 w-24 rounded xl:h-8')} />
    <div className="flex flex-col gap-2">
      <div className={cn(PULSE, 'h-4 w-full max-w-[28rem] rounded')} />
      <div className={cn(PULSE, 'h-4 w-full max-w-[22rem] rounded')} />
    </div>
    <div className="flex flex-wrap gap-2 xl:gap-3">
      <div className={cn(PULSE, 'h-8 w-16 rounded-full')} />
      <div className={cn(PULSE, 'h-8 w-20 rounded-full')} />
      <div className={cn(PULSE, 'h-8 w-14 rounded-full')} />
    </div>
  </section>
);

/** `/movers/[id]` 본문 스켈레톤 */
export const MoverDetailContentSkeleton = () => {
  const { t } = useTranslation();

  return (
    <div
      className="flex w-full flex-col overflow-x-hidden bg-white pb-24 xl:pb-0"
      role="status"
      aria-busy="true"
      aria-label={t('a11y.skeleton.moverDetail')}
    >
    <div className={MOVERS_DETAIL_SKELETON_CLASS}>
      <div className="flex min-w-0 flex-1 flex-col">
        <MoverCardSkeleton />
        <div className="mt-6 border-t border-line-100 xl:mt-10" />
        <section className="flex flex-col gap-4 border-b border-line-100 py-6 xl:hidden">
          <div className={cn(PULSE, 'h-5 w-48 rounded')} />
          <div className="flex gap-3">
            <div className={cn(PULSE, 'size-10 rounded-full')} />
            <div className={cn(PULSE, 'size-10 rounded-full')} />
            <div className={cn(PULSE, 'size-10 rounded-full')} />
          </div>
        </section>
        <DetailSectionSkeleton />
        <DetailSectionSkeleton />
        <section className="flex flex-col gap-4 py-6 xl:gap-8 xl:py-10">
          <div className={cn(PULSE, 'h-6 w-28 rounded xl:h-8')} />
          <div className={cn(PULSE, 'h-28 w-full rounded-2xl')} />
          <div className="flex flex-col gap-4">
            <div className={cn(PULSE, 'h-16 w-full rounded-2xl')} />
            <div className={cn(PULSE, 'h-16 w-full rounded-2xl')} />
          </div>
        </section>
      </div>

      <aside
        className="hidden w-full max-w-[22.125rem] shrink-0 flex-col gap-10 xl:flex"
        aria-hidden
      >
        <div className="flex flex-col gap-4">
          <div className={cn(PULSE, 'h-14 w-full rounded-2xl')} />
          <div className={cn(PULSE, 'h-14 w-full rounded-2xl')} />
        </div>
        <div className="flex flex-col gap-[1.375rem] border-t border-line-100 pt-10">
          <div className={cn(PULSE, 'h-6 w-52 rounded')} />
          <div className="flex gap-3">
            <div className={cn(PULSE, 'size-12 rounded-full')} />
            <div className={cn(PULSE, 'size-12 rounded-full')} />
            <div className={cn(PULSE, 'size-12 rounded-full')} />
          </div>
        </div>
      </aside>
    </div>
  </div>
  );
};
