import Link from 'next/link';

import TextLogoIcon from '@/assets/icons/text-logo.svg';
import { cn } from '@/lib/utils';

interface AuthPromptLinkProps {
  prompt: string;
  linkLabel: string;
  href: string;
  className?: string;
}

export const AuthHelperText = ({
  prompt,
  linkLabel,
  href,
  className = '',
}: AuthPromptLinkProps) => {
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

export const AuthBrand = ({
  prompt,
  linkLabel,
  href,
  className = '',
}: AuthPromptLinkProps) => {
  return (
    <div className={cn('flex flex-col items-center lg:gap-2', className)}>
      <Link
        href="/"
        aria-label="무빙"
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
