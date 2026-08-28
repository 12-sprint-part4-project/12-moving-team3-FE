import KakaoIcon from '@/assets/icons/kakao.svg';
import { cn } from '@/lib/utils';

interface AuthKakaoSectionProps {
  hint: string;
  ariaLabel: string;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

/** 로그인·회원가입 공통 카카오 버튼 */
export const AuthKakaoSection = ({
  hint,
  ariaLabel,
  disabled = false,
  onClick,
  className = '',
}: AuthKakaoSectionProps) => {
  return (
    <div
      className={cn('flex flex-col items-center gap-6 lg:gap-8', className)}
    >
      <p className="text-xs-regular text-black-100 lg:text-xl-regular lg:text-black-200">
        {hint}
      </p>
      <button
        type="button"
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={onClick}
        className="inline-flex size-[3.375rem] shrink-0 cursor-pointer items-center justify-center overflow-clip rounded-full disabled:cursor-not-allowed disabled:opacity-50 lg:size-[4.5rem]"
      >
        <KakaoIcon className="size-full" aria-hidden focusable="false" />
      </button>
    </div>
  );
};
