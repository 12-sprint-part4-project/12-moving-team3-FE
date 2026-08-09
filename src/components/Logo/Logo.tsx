import Image from 'next/image';
import Link from 'next/link';

export type LogoSize = 'sm' | 'md';
export type LogoVariant = 'iconText' | 'icon';

export interface LogoProps {
  /** 로고 크기. sm / md (Figma logo-text · logo-icon) */
  size?: LogoSize;
  /**
   * iconText=로고(아이콘+무빙), icon=심볼(아이콘만).
   * Figma 기준:
   * - gnb/landing: 모든 size → iconText
   * - gnb/default · gnb/2-depth: sm → icon, md/lg → iconText
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
  icon: '/symbol.svg',
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
    <span className={`relative block ${SIZE_STYLE[variant][size]}`}>
      <Image
        src={LOGO_SRC[variant]}
        alt="무빙"
        fill
        sizes="116px"
        className="object-contain"
      />
    </span>
  </Link>
);
