import Image from 'next/image';

import { cn } from '@/lib/utils';

export interface RequestsEmptyStateProps {
  className?: string;
}

/** 받은 요청 빈 목록 안내 표시 */
export const RequestsEmptyState = ({
  className = '',
}: RequestsEmptyStateProps) => (
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
      아직 받은 요청이 없어요!
    </p>
  </div>
);
