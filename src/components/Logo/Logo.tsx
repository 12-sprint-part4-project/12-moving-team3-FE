import Link from 'next/link';

export type LogoSize = 'sm' | 'md';
export type LogoVariant = 'iconText' | 'icon';

export interface LogoProps {
  /** 로고 크기. sm / md (Figma logo-text · logo-icon) */
  size?: LogoSize;
  /**
   * iconText=아이콘+워드마크, icon=아이콘만.
   * Figma gnb/default sm은 icon, md/lg는 iconText를 사용한다.
   */
  variant?: LogoVariant;
  /** 클릭 시 이동할 경로 */
  href?: string;
  className?: string;
}

const SIZE_STYLE: Record<LogoVariant, Record<LogoSize, string>> = {
  iconText: {
    sm: 'h-[2.125rem] w-[5.5rem]',
    md: 'h-11 w-[7.25rem]',
  },
  icon: {
    sm: 'h-[2.0475rem] w-[1.8rem]',
    md: 'h-[2.73rem] w-[2.4rem]',
  },
};

const LOGO_SRC: Record<LogoVariant, string> = {
  iconText: '/logo.svg',
  icon: '/logo-icon.svg',
};

/**
 * 무빙 로고.
 * Figma "img/logo/icon-text" · "img/logo/icon" — Property 2=sm | md.
 * 로고는 Static SVG를 사용한다.
 */
export const Logo = ({
  size = 'sm',
  variant = 'iconText',
  href = '/',
  className = '',
}: LogoProps) => (
  <Link
    href={href}
    className={`inline-flex shrink-0 items-center justify-center ${className}`}
  >
    <img
      src={LOGO_SRC[variant]}
      alt="무빙"
      className={SIZE_STYLE[variant][size]}
    />
  </Link>
);
