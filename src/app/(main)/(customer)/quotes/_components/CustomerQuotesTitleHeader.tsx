import { cn } from '@/lib/utils';

export interface CustomerQuotesTitleHeaderProps {
  title: string;
  paddingClassName: string;
  className?: string;
}

/** `/quotes/history`·`/quotes/[quoteId]` 타이틀 헤더. */
export const CustomerQuotesTitleHeader = ({
  title,
  paddingClassName,
  className = '',
}: CustomerQuotesTitleHeaderProps) => (
  // 페이지 제목(h1)
  <div
    className={cn(
      'border-b border-line-100 bg-white py-4 shadow-page-title md:py-6 lg:py-8',
      paddingClassName,
      className
    )}
  >
    <h1 className="text-2lg-semibold text-black-400 lg:text-2xl-semibold">
      {title}
    </h1>
  </div>
);
