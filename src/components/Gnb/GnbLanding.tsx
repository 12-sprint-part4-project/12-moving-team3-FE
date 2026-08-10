'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import MenuIcon from '@/assets/icons/menu.svg';

import { isGnbNavActive } from '@/components/Gnb/gnbNav';
import { Logo } from '@/components/Logo/Logo';
import { cn } from '@/lib/utils';

export type GnbLandingSize = 'sm' | 'md' | 'lg';

export interface GnbLandingProps {
  /** 반응형 사이즈. sm=모바일, md=태블릿, lg=PC */
  size?: GnbLandingSize;
  /** 홈(로고) 링크 */
  homeHref?: string;
  /** 기사님 찾기 링크 (lg 전용) */
  findDriverHref?: string;
  /** 커뮤니티 링크 (lg 전용) */
  communityHref?: string;
  /** 로그인 링크 (lg 전용) */
  loginHref?: string;
  /** 햄버거 메뉴 클릭 (sm/md 전용) */
  onMenuClick?: () => void;
  className?: string;
}

const ROOT_STYLE: Record<GnbLandingSize, string> = {
  sm: 'h-[3.375rem] justify-between px-6 py-2.5',
  md: 'h-[3.375rem] justify-between px-8 py-[1.1875rem]',
  lg: 'h-[5.5rem] gap-[5.125rem] px-[7.5rem] py-[1.625rem]',
};

/**
 * 랜딩 페이지 GNB.
 * Figma "gnb/landing" — size=sm | md | lg.
 * - 브랜드: 모든 size에서 로고(iconText)
 * - sm/md: 로고 + 햄버거 메뉴
 * - lg: 로고 + 기사님 찾기 + 로그인 CTA
 */
export const GnbLanding = ({
  size = 'sm',
  homeHref = '/',
  findDriverHref = '/movers',
  communityHref = '/community',
  loginHref = '/login',
  onMenuClick,
  className = '',
}: GnbLandingProps) => {
  const pathname = usePathname();
  const isDesktop = size === 'lg';
  const isFindDriverActive = isGnbNavActive(pathname, findDriverHref);
  const isCommunityActive = isGnbNavActive(pathname, communityHref);

  return (
    <header
      className={`flex w-full items-center border-b border-line-100 bg-white ${ROOT_STYLE[size]} ${className}`}
    >
      <Logo
        size={isDesktop ? 'md' : 'sm'}
        variant="iconText"
        href={homeHref}
      />

      {isDesktop ? (
        <>
          <nav className="flex min-w-0 flex-1 items-center gap-10">
            <Link
              href={findDriverHref}
              aria-current={isFindDriverActive ? 'page' : undefined}
              className={cn(
                'text-2lg-bold',
                isFindDriverActive ? 'text-gray-400' : 'text-black-400'
              )}
            >
              기사님 찾기
            </Link>
            <Link
              href={communityHref}
              aria-current={isCommunityActive ? 'page' : undefined}
              className={cn(
                'text-2lg-bold',
                isCommunityActive ? 'text-gray-400' : 'text-black-400'
              )}
            >
              커뮤니티
            </Link>
          </nav>
          <Link
            href={loginHref}
            className="inline-flex h-11 w-[7.25rem] shrink-0 items-center justify-center rounded-2xl bg-blue-300 text-2lg-semibold text-white"
          >
            로그인
          </Link>
        </>
      ) : (
        <button
          type="button"
          aria-label="메뉴 열기"
          onClick={onMenuClick}
          className="inline-flex size-6 shrink-0 items-center justify-center [&_path]:stroke-gray-300"
        >
          <MenuIcon className="size-6" aria-hidden />
        </button>
      )}
    </header>
  );
};
