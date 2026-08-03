'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/Button/Button';
import { cn } from '@/lib/utils';

export type PendingQuotesEmptyVariant =
  'waiting' | 'noRequest' | 'receivedPlaceholder';

export interface PendingQuotesEmptyStateProps {
  variant: PendingQuotesEmptyVariant;
  className?: string;
}

const EMPTY_COPY: Record<
  PendingQuotesEmptyVariant,
  { lines: string[]; actionHref?: string; actionLabel?: string }
> = {
  waiting: {
    lines: ['기사님들이 열심히 확인 중이에요', '곧 견적이 도착할 거예요!'],
  },
  noRequest: {
    lines: ['대기 중인 견적이 없어요!'],
    actionHref: '/estimates/request',
    actionLabel: '견적 요청하기',
  },
  receivedPlaceholder: {
    lines: ['아직 받았던 견적이 없어요!'],
  },
};

/** 고객 내 견적 관리 빈 상태 */
export const PendingQuotesEmptyState = ({
  variant,
  className = '',
}: PendingQuotesEmptyStateProps) => {
  const router = useRouter();
  const copy = EMPTY_COPY[variant];

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center gap-6 py-16 lg:gap-8 lg:py-[11.25rem]',
        className
      )}
      role="status"
    >
      <Image
        src="/images/empty.svg"
        alt=""
        width={184}
        height={136}
        className="h-[8.5rem] w-[11.5rem]"
      />
      <div className="flex flex-col items-center gap-1">
        {copy.lines.map((line) => (
          <p
            key={line}
            className="text-center text-lg-regular text-gray-400 lg:text-xl-regular"
          >
            {line}
          </p>
        ))}
      </div>
      {copy.actionHref && copy.actionLabel ? (
        <Button
          size="sm"
          variant="solid"
          className="max-w-[12rem]"
          onClick={() => {
            if (copy.actionHref) {
              router.push(copy.actionHref);
            }
          }}
        >
          {copy.actionLabel}
        </Button>
      ) : null}
    </div>
  );
};
