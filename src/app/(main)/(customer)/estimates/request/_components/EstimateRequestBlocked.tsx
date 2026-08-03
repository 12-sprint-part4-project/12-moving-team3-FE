'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import { EstimateRequestPageHeader } from './EstimateRequestPageHeader';
import { Button } from '@/components/Button/Button';
import { cn } from '@/lib/utils';

interface EstimateRequestBlockedProps {
  className?: string;
  /** 안내 문구 (줄바꿈은 <br /> 등으로 구성) */
  message: ReactNode;
  actionLabel: string;
  /** 있으면 해당 경로로 이동 */
  actionHref?: string;
  /** href 없이 클릭만 처리할 때 (다시 시도 등) */
  onActionClick?: () => void;
  role?: 'alert' | 'status';
}

/**
 * 진행 중 견적(blocked·제출 후) 전용 빈 화면.
 * 비회원·프로필 미등록은 EstimateRequestGate(채팅형)로 처리.
 */
export const EstimateRequestBlocked = ({
  className,
  message,
  actionLabel,
  actionHref,
  onActionClick,
  role = 'status',
}: EstimateRequestBlockedProps) => {
  const router = useRouter();

  const handleAction = () => {
    if (onActionClick) {
      onActionClick();
      return;
    }
    if (actionHref) {
      router.push(actionHref);
    }
  };

  return (
    // flex-1: GNB 아래 main 남은 높이를 채워 빈 화면에서도 배경이 뷰포트까지 이어짐
    <div
      className={cn(
        'flex min-h-0 w-full flex-1 flex-col bg-background-200',
        className
      )}
    >
      <EstimateRequestPageHeader />

      <div className="flex w-full flex-1 flex-col justify-center gap-4 py-6 md:py-[3rem]">
        <div className="page-content flex flex-col items-center gap-8 md:gap-6">
          <div className="flex flex-col items-center gap-16">
            <Image
              src="/images/no-estimate.svg"
              alt=""
              width={351}
              height={140}
              className="h-[8.75rem] w-[21.9375rem]"
              priority
            />
            <p
              className="text-center text-lg-regular text-gray-400 md:text-xl-regular"
              role={role}
            >
              {message}
            </p>
          </div>

          <Button
            type="button"
            variant="solid"
            size="sm"
            className="max-w-[12.25rem] px-6 md:h-16 md:text-xl-semibold"
            onClick={handleAction}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
