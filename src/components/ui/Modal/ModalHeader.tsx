'use client';

import { useId, type ReactNode } from 'react';

import CloseIcon from '@/assets/icons/close.svg';

import { cn } from '@/lib/utils';

export interface ModalHeaderProps {
  /** 문자열 또는 혼합 타이포(예: 이사 유형 + 필터)용 ReactNode */
  title: ReactNode;
  onClose: () => void;
  className?: string;
  /** h2 타이포 오버라이드. 혼합 타이포 title일 때 기본 스타일을 비운다 */
  titleClassName?: string;
  /** aria-labelledby 연결용 id. 미지정 시 내부에서 생성 */
  titleId?: string;
}

/**
 * 모달 콘텐츠 상단의 제목 + 닫기 버튼.
 * Modal 셸과 무관하게, 각 XxxModal이 자신의 헤더로 조합해 쓴다.
 */
export const ModalHeader = ({
  title,
  onClose,
  className = '',
  titleClassName,
  titleId: titleIdProp,
}: ModalHeaderProps) => {
  const generatedId = useId();
  const titleId = titleIdProp ?? generatedId;

  return (
    <div className={cn('flex w-full items-center justify-between', className)}>
      <h2
        id={titleId}
        className={cn(
          'text-2lg-bold text-black-400 sm:text-2xl-semibold',
          titleClassName
        )}
      >
        {title}
      </h2>
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="flex size-6 shrink-0 cursor-pointer items-center justify-center text-gray-400 sm:size-9"
      >
        <CloseIcon className="size-full" aria-hidden />
      </button>
    </div>
  );
};
