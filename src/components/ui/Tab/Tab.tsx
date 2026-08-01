import type { ButtonHTMLAttributes } from 'react';

export type TabVariant = 'default' | 'depth';

export interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 활성 상태.
   * Figma Property 1=active | default에 해당한다.
   */
  active?: boolean;
  /**
   * 탭 스타일 변형.
   * - default: Figma "tap" (GNB 기본 탭)
   * - depth: Figma "gnb/2-depth" 탭
   */
  variant?: TabVariant;
  className?: string;
}

const VARIANT_STYLE: Record<
  TabVariant,
  { base: string; active: string; inactive: string }
> = {
  default: {
    base: 'h-[3.375rem] items-center',
    active: 'border-b-2 border-blue-400 text-md-bold text-black-400',
    inactive: 'text-md-semibold text-gray-400',
  },
  depth: {
    base: 'items-center justify-center self-stretch py-4',
    active: 'border-b-2 border-black-400 text-xl-semibold text-black-400',
    inactive: 'text-xl-semibold text-gray-400',
  },
};

/**
 * 탭 아이템.
 * Figma "tap" — Property 1=active | default.
 */
export const Tab = ({
  active = false,
  variant = 'default',
  className = '',
  type = 'button',
  children,
  ...rest
}: TabProps) => {
  const style = VARIANT_STYLE[variant];

  return (
    <button
      type={type}
      role="tab"
      aria-selected={active}
      className={`flex cursor-pointer whitespace-nowrap ${style.base} ${
        active ? style.active : style.inactive
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
