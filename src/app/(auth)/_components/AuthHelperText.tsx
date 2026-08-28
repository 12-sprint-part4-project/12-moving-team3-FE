import Link from 'next/link';

import { cn } from '@/lib/utils';

interface AuthHelperTextProps {
  prompt: string;
  linkLabel: string;
  href: string;
  className?: string;
}

/** 로그인·회원가입 안내 문구와 링크 */
export const AuthHelperText = ({
  prompt,
  linkLabel,
  href,
  className = '',
}: AuthHelperTextProps) => {
  return (
    <p
      className={cn(
        'flex items-center justify-center gap-1 whitespace-nowrap text-xs-regular lg:gap-2 lg:text-xl-regular',
        className
      )}
    >
      <span className="text-black-100 lg:text-black-200">{prompt}</span>
      <Link
        href={href}
        className="text-xs-semibold text-blue-300 underline lg:text-xl-semibold"
      >
        {linkLabel}
      </Link>
    </p>
  );
};
