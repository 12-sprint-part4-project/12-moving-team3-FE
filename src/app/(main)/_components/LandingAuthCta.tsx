'use client';

import Link from 'next/link';

import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const CTA_BASE_STYLE =
  'inline-flex h-[3.375rem] w-full shrink-0 items-center justify-center rounded-full text-lg-semibold transition-colors lg:h-16 lg:w-[21.25rem] lg:text-xl-semibold';

/** 비로그인일 때만 랜딩 CTA(로그인·회원가입)를 노출한다. */
export const LandingAuthCta = () => {
  const { user, isReady } = useAuth();

  if (!isReady || user) return null;

  return (
    <div className="mt-11 flex w-full max-w-[20.4375rem] flex-col gap-2 lg:mt-12 lg:w-auto lg:max-w-none lg:flex-row lg:items-center lg:justify-center lg:gap-4">
      <Link
        href="/login"
        prefetch={false}
        className={cn(
          CTA_BASE_STYLE,
          'bg-blue-300 text-white shadow-cta hover:bg-blue-200'
        )}
      >
        로그인
      </Link>
      <Link
        href="/signup"
        prefetch={false}
        className={cn(
          CTA_BASE_STYLE,
          'border border-blue-300 bg-white text-blue-300 shadow-cta hover:bg-blue-50 hover:shadow-cta-hover'
        )}
      >
        회원가입
      </Link>
    </div>
  );
};
