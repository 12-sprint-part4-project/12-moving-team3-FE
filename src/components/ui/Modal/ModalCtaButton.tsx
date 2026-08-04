'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface ModalCtaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

/**
 * 모달 하단 전체 너비 CTA 버튼.
 * Figma Button/solid/CTA: 활성=blue-300, 비활성=gray-100.
 * (공용 Button은 임시 예시라 모달 CTA 스펙에 맞춰 독립 구현)
 */
export const ModalCtaButton = ({
  children,
  className = '',
  type = 'button',
  disabled,
  ...rest
}: ModalCtaButtonProps) => (
  <button
    type={type}
    disabled={disabled}
    className={cn(
      'flex h-[3.375rem] w-full cursor-pointer items-center justify-center rounded-2xl bg-blue-300 p-4 text-lg-semibold text-white transition-colors disabled:bg-gray-100 sm:h-16 sm:text-xl-semibold',
      className
    )}
    {...rest}
  >
    {children}
  </button>
);
