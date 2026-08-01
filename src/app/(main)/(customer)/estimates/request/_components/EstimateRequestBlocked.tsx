'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

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
 * 견적요청 진입 불가·완료 공통 안내 화면.
 * 레이아웃: 제목 + 트럭 일러스트 + 문구 + CTA (Figma 1-11375).
 *
 * 사용처: 비회원 / 프로필 미등록 / 진행 중(blocked·제출 후) / 일반 에러
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
    <div className={cn('flex min-h-full w-full flex-col bg-background-200', className)}>
      <header className="w-full bg-white py-6 shadow-page-title md:py-8">
        <div className="mx-auto w-full max-w-[375px] px-6 md:max-w-[1448px]">
          <h1 className="text-2lg-semibold text-black-400 md:text-2xl-semibold">
            견적요청
          </h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 md:py-24">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-16">
            {/* Figma img/car — public/images/no-estimate.svg (351×140) */}
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
            className="w-auto px-6 md:h-16 md:text-xl-semibold"
            onClick={handleAction}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
