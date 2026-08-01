import Image from 'next/image';

import { cn } from '@/lib/utils';
import type { QuoteListStatus } from '@/types/quote';

export interface QuotesEmptyStateProps {
  status: QuoteListStatus;
  className?: string;
}

const EMPTY_MESSAGE: Record<QuoteListStatus, string> = {
  SENT: '아직 보낸 견적이 없어요!',
  REJECTED: '아직 반려한 요청이 없어요!',
};

/** 내 견적 관리 빈 목록 안내 표시 */
export const QuotesEmptyState = ({
  status,
  className = '',
}: QuotesEmptyStateProps) => (
  <div
    className={cn(
      'flex w-full flex-col items-center justify-center gap-8 py-16 lg:py-[11.25rem]',
      className
    )}
  >
    <Image
      src="/images/empty.svg"
      alt=""
      width={184}
      height={136}
      className="h-[8.5rem] w-[11.5rem]"
    />
    <p className="text-center text-xl-regular text-gray-400">
      {EMPTY_MESSAGE[status]}
    </p>
  </div>
);
