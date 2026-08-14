import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

interface EstimateRequestPageHeaderProps {
  /** 진행 바 등 타이틀 아래 부가 UI */
  children?: ReactNode;
  className?: string;
}

/**
 * 견적요청 페이지 공통 타이틀 헤더.
 * Progress(진행 바 포함) / Blocked(타이틀만)에서 재사용.
 */
export const EstimateRequestPageHeader = ({
  children,
  className,
}: EstimateRequestPageHeaderProps) => {
  return (
    <header
      className={cn(
        'w-full bg-white py-6 shadow-page-title md:py-8',
        className
      )}
    >
      <div
        className={cn(
          'page-content',
          children != null && 'flex flex-col gap-4 md:gap-6'
        )}
      >
        <h1 className="text-2lg-semibold text-black-400 md:text-2xl-semibold">
          견적요청
        </h1>
        {children}
      </div>
    </header>
  );
};
