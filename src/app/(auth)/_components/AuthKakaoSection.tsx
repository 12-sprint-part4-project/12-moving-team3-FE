import KakaoIcon from '@/assets/icons/kakao.svg';
import { cn } from '@/lib/utils';

import {
  AUTH_KAKAO_BUTTON_CLASS,
  AUTH_SNS_CAPTION_CLASS,
  AUTH_SNS_CLASS,
} from './authStyles';

interface AuthKakaoSectionProps {
  ariaLabel: string;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

export const AuthKakaoSection = ({
  ariaLabel,
  disabled = false,
  onClick,
  className = '',
}: AuthKakaoSectionProps) => {
  return (
    <div className={cn(AUTH_SNS_CLASS, className)}>
      <p className={AUTH_SNS_CAPTION_CLASS}>SNS 계정으로 간편 가입하기</p>
      <button
        type="button"
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={onClick}
        className={AUTH_KAKAO_BUTTON_CLASS}
      >
        <KakaoIcon className="size-full" aria-hidden focusable="false" />
      </button>
    </div>
  );
};
