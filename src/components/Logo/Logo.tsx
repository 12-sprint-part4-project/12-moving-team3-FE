import Link from 'next/link';

export type LogoSize = 'sm' | 'md';

export interface LogoProps {
  /** 로고 크기. sm=88×34, md=116×44 (Figma logo-text) */
  size?: LogoSize;
  /** 클릭 시 이동할 경로 */
  href?: string;
  className?: string;
}

const SIZE_STYLE: Record<LogoSize, string> = {
  sm: 'h-[2.125rem] w-[5.5rem]',
  md: 'h-11 w-[7.25rem]',
};

/**
 * 무빙 로고 (아이콘 + 워드마크).
 * Figma "img/logo/icon-text" — Property 2=sm | md.
 * 로고는 Static SVG를 사용한다.
 */
export const Logo = ({
  size = 'sm',
  href = '/',
  className = '',
}: LogoProps) => (
  <Link
    href={href}
    className={`inline-flex shrink-0 items-center justify-center ${className}`}
  >
    <img src="/logo.svg" alt="무빙" className={SIZE_STYLE[size]} />
  </Link>
);
