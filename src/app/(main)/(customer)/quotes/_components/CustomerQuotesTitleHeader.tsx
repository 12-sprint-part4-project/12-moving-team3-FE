import { cn } from '@/lib/utils';

import {
  CUSTOMER_QUOTES_TITLE_CLASS,
  CUSTOMER_QUOTES_TITLE_HEADER_CLASS,
} from './customerQuotesLayout';

export interface CustomerQuotesTitleHeaderProps {
  title: string;
  paddingClassName: string;
  className?: string;
}

/** 이용 내역·견적 상세 페이지 타이틀 헤더 */
export const CustomerQuotesTitleHeader = ({
  title,
  paddingClassName,
  className = '',
}: CustomerQuotesTitleHeaderProps) => (
  <div
    className={cn(
      CUSTOMER_QUOTES_TITLE_HEADER_CLASS,
      paddingClassName,
      className
    )}
  >
    <h1 className={CUSTOMER_QUOTES_TITLE_CLASS}>{title}</h1>
  </div>
);
