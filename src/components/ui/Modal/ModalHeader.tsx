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
  /** 제목 정렬. center면 닫기는 오른쪽 고정 */
  titleAlign?: 'start' | 'center';
  /** aria-labelledby 연결용 id. 미지정 시 내부에서 생성 */
  titleId?: string;
  /** true면 닫기 버튼 비활성 (요청 진행 중 등) */
  closeDisabled?: boolean;
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
  titleAlign = 'start',
  titleId: titleIdProp,
  closeDisabled = false,
}: ModalHeaderProps) => {
  const generatedId = useId();
  const titleId = titleIdProp ?? generatedId;
  const isCentered = titleAlign === 'center';

  return (
    <div
      className={cn(
        'relative flex w-full items-center',
        isCentered ? 'min-h-6 justify-center sm:min-h-9' : 'justify-between',
        className
      )}
    >
      <h2
        id={titleId}
        className={cn(
          'text-2lg-bold text-black-400 sm:text-2xl-semibold',
          isCentered && 'text-center',
          titleClassName
        )}
      >
        {title}
      </h2>
      <button
        type="button"
        aria-label="닫기"
        disabled={closeDisabled}
        aria-disabled={closeDisabled}
        onClick={onClose}
        className={cn(
          'flex size-6 shrink-0 items-center justify-center text-gray-400 sm:size-9',
          isCentered && 'absolute top-1/2 right-0 -translate-y-1/2',
          closeDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
        )}
      >
        <CloseIcon className="size-full" aria-hidden />
      </button>
    </div>
  );
};
