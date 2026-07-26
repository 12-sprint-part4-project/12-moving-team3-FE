import type { ButtonHTMLAttributes, ReactNode } from 'react';

import EditIcon from '@/assets/icons/edit.svg';

export type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  /** 버튼 크기. sm=54px/16px, md=64px/20px (Figma Button Solid CTA) */
  size?: ButtonSize;
  /**
   * true면 텍스트 오른쪽에 writing(수정) 아이콘을 표시한다.
   * Figma `solid-icon` 변형에 해당한다.
   */
  showIcon?: boolean;
  children: ReactNode;
  className?: string;
}

const SIZE_STYLE: Record<ButtonSize, string> = {
  sm: 'h-[3.375rem] gap-1 px-4 text-lg-semibold',
  md: 'h-16 gap-2 px-4 text-xl-semibold',
};

/**
 * Primary Solid CTA 버튼.
 * Figma "Button Solid CTA" 프레임 기준 — default(blue-300) / hover(blue-200) /
 * disabled(gray-100), size sm|md, 선택적 writing 아이콘.
 */
export const Button = ({
  size = 'sm',
  showIcon = false,
  disabled = false,
  children,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled}
    className={`inline-flex w-full items-center justify-center rounded-2xl bg-blue-300 text-white transition-colors hover:bg-blue-200 disabled:bg-gray-100 disabled:hover:bg-gray-100 ${SIZE_STYLE[size]} ${className}`}
    {...rest}
  >
    {children}
    {showIcon ? <EditIcon className="size-6 shrink-0" aria-hidden /> : null}
  </button>
);
