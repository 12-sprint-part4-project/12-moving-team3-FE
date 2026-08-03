import type { ButtonHTMLAttributes, ReactNode } from 'react';

import EditIcon from '@/assets/icons/edit.svg';

export type ButtonSize = 'sm' | 'md';
export type ButtonVariant = 'solid' | 'outlined';

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  /** 버튼 크기. sm=54px/16px, md=64px/20px */
  size?: ButtonSize;
  /** solid=채움(Primary CTA), outlined=테두리(Outlined CTA) */
  variant?: ButtonVariant;
  /**
   * true면 텍스트 오른쪽에 writing(수정) 아이콘을 표시한다.
   * Figma Solid CTA의 `solid-icon` 변형에 해당한다.
   */
  showIcon?: boolean;
  children: ReactNode;
  className?: string;
}

const SIZE_STYLE: Record<ButtonVariant, Record<ButtonSize, string>> = {
  solid: {
    sm: 'h-[3.375rem] gap-1 px-4 text-lg-semibold',
    md: 'h-16 gap-2 px-4 text-xl-semibold',
  },
  outlined: {
    sm: 'h-[3.375rem] gap-1 px-6 text-lg-semibold',
    md: 'h-16 gap-2 px-6 text-xl-semibold',
  },
};

const VARIANT_STYLE: Record<ButtonVariant, string> = {
  solid:
    'bg-blue-300 text-white hover:bg-blue-200 disabled:bg-gray-100 disabled:hover:bg-gray-100',
  outlined:
    'border border-blue-300 bg-transparent text-blue-300 shadow-cta hover:bg-blue-50 hover:shadow-cta-hover disabled:border-gray-100 disabled:text-gray-300 disabled:hover:bg-transparent disabled:hover:shadow-cta',
};

/**
 * Primary CTA 버튼.
 * - solid: Figma "Button Solid CTA" — default(blue-300) / hover(blue-200) / disabled(gray-100)
 * - outlined: Figma "Button/outlined/CTA" — default·hover(blue-300 테두리) / hover(bg blue-50) / disabled(gray)
 */
export const Button = ({
  size = 'sm',
  variant = 'solid',
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
    className={`inline-flex w-full cursor-pointer items-center justify-center rounded-2xl transition-colors disabled:cursor-not-allowed ${VARIANT_STYLE[variant]} ${SIZE_STYLE[variant][size]} ${className}`}
    {...rest}
  >
    {children}
    {showIcon ? <EditIcon className="size-6 shrink-0" aria-hidden /> : null}
  </button>
);
