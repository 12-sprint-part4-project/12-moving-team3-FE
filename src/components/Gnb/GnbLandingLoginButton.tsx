'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';

export interface GnbLandingLoginButtonProps {
  href?: string;
  className?: string;
}

/** 랜딩 GNB 로그인 버튼 (Client). */
export const GnbLandingLoginButton = ({
  href = '/login',
  className,
}: GnbLandingLoginButtonProps) => (
  <Link
    href={href}
    className={cn(
      'inline-flex h-11 w-[7.25rem] shrink-0 items-center justify-center rounded-2xl bg-blue-300 text-2lg-semibold text-white',
      className
    )}
  >
    로그인
  </Link>
);
