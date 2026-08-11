import type { ReactNode } from 'react';
import Link from 'next/link';

import { Logo } from '@/components/Logo/Logo';
import { cn } from '@/lib/utils';

export type GnbLandingSize = 'sm' | 'md' | 'lg';

export interface GnbLandingProps {
  size?: GnbLandingSize;
  homeHref?: string;
  findDriverHref?: string;
  communityHref?: string;
  loginButton?: ReactNode;
  menuSlot?: ReactNode;
  className?: string;
}

const ROOT_STYLE: Record<GnbLandingSize, string> = {
  sm: 'h-[3.375rem] justify-between px-6 py-2.5',
  md: 'h-[3.375rem] justify-between px-8 py-[1.1875rem]',
  lg: 'h-[5.5rem] gap-[5.125rem] px-[7.5rem] py-[1.625rem]',
};

export const GnbLanding = ({
  size = 'sm',
  homeHref = '/',
  findDriverHref = '/movers',
  communityHref = '/community',
  loginButton,
  menuSlot,
  className = '',
}: GnbLandingProps) => {
  const isDesktop = size === 'lg';

  return (
    <header
      className={cn(
        'flex w-full items-center border-b border-line-100 bg-white',
        ROOT_STYLE[size],
        className
      )}
    >
      <Logo
        size={isDesktop ? 'md' : 'sm'}
        variant="iconText"
        href={homeHref}
      />

      {isDesktop ? (
        <>
          <nav className="flex min-w-0 flex-1 items-center gap-10">
            <Link href={findDriverHref} className="text-2lg-bold text-black-400">
              기사님 찾기
            </Link>
            <Link href={communityHref} className="text-2lg-bold text-black-400">
              커뮤니티
            </Link>
          </nav>
          {loginButton}
        </>
      ) : (
        menuSlot
      )}
    </header>
  );
};
