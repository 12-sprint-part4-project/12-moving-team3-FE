'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/useTranslation';

import { cn } from '@/lib/utils';

export interface GnbLandingLoginButtonProps {
  href?: string;
  className?: string;
}

export const GnbLandingLoginButton = ({
  href = '/login',
  className,
}: GnbLandingLoginButtonProps) => {
  const { t } = useTranslation();

  return (
    <Link
      href={href}
      prefetch={false}
      className={cn(
        'inline-flex h-11 w-[7.25rem] shrink-0 items-center justify-center rounded-2xl bg-blue-300 text-2lg-semibold text-white',
        className
      )}
    >
      {t('common.login')}
    </Link>
  );
};
