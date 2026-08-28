'use client';

import Link from 'next/link';

import LogoIconText from '@/assets/icons/logo.svg';
import LogoSymbol from '@/assets/icons/symbol.svg';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

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
  /** Next.js Link prefetch. 랜딩 등에서 불필요 RSC 요청을 줄이려면 false */
  prefetch?: boolean;
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

const LOGO_COMPONENT: Record<
  LogoVariant,
  typeof LogoIconText | typeof LogoSymbol
> = {
  iconText: LogoIconText,
  icon: LogoSymbol,
};

/**
 * 무빙 로고.
 * Figma "img/logo/icon-text" · "img/logo/icon" — Property 2=sm | md.
 * 브랜드 SVG는 SVGR 컴포넌트로 인라인한다.
 */
export const Logo = ({
  size = 'sm',
  variant = 'iconText',
  href = '/',
  prefetch,
  className = '',
}: LogoProps) => {
  const { t } = useTranslation();
  const LogoSvg = LOGO_COMPONENT[variant];

  return (
    <Link
      href={href}
      prefetch={prefetch}
      aria-label={t('auth.brand')}
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        className
      )}
    >
      <LogoSvg
        className={SIZE_STYLE[variant][size]}
        aria-hidden
        focusable="false"
      />
    </Link>
  );
};
