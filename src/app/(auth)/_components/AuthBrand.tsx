import Link from 'next/link';

import TextLogoIcon from '@/assets/icons/text-logo.svg';
import { cn } from '@/lib/utils';

import { AuthHelperText } from './AuthHelperText';

interface AuthBrandProps {
  prompt: string;
  linkLabel: string;
  href: string;
  ariaLabel: string;
  className?: string;
}

/** 로그인·회원가입 상단 로고와 역할 전환 문구 */
export const AuthBrand = ({
  prompt,
  linkLabel,
  href,
  ariaLabel,
  className = '',
}: AuthBrandProps) => {
  return (
    <div className={cn('flex flex-col items-center lg:gap-2', className)}>
      <Link
        href="/"
        aria-label={ariaLabel}
        className="flex w-full max-w-[20.4375rem] flex-col items-center justify-center p-2.5 lg:max-w-[40rem]"
      >
        <TextLogoIcon
          className="h-16 w-[7rem] lg:h-20 lg:w-[8.75rem]"
          aria-hidden
          focusable="false"
        />
      </Link>
      <AuthHelperText prompt={prompt} linkLabel={linkLabel} href={href} />
    </div>
  );
};
