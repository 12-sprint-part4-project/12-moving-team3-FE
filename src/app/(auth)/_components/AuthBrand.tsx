import Link from 'next/link';

import TextLogoIcon from '@/assets/icons/text-logo.svg';
import { cn } from '@/lib/utils';

import {
  AUTH_BRAND_CLASS,
  AUTH_HELPER_LINK_CLASS,
  AUTH_HELPER_MUTED_CLASS,
  AUTH_HELPER_TEXT_CLASS,
  AUTH_LOGO_ICON_CLASS,
  AUTH_LOGO_LINK_CLASS,
} from './authStyles';

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
    <p className={cn(AUTH_HELPER_TEXT_CLASS, className)}>
      <span className={AUTH_HELPER_MUTED_CLASS}>{prompt}</span>
      <Link href={href} className={AUTH_HELPER_LINK_CLASS}>
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
    <div className={cn(AUTH_BRAND_CLASS, className)}>
      <Link href="/" aria-label="무빙" className={AUTH_LOGO_LINK_CLASS}>
        <TextLogoIcon
          className={AUTH_LOGO_ICON_CLASS}
          aria-hidden
          focusable="false"
        />
      </Link>
      <AuthHelperText prompt={prompt} linkLabel={linkLabel} href={href} />
    </div>
  );
};
