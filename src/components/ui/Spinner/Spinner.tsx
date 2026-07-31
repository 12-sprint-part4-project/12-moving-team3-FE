import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
  className?: string;
}

/**
 * 로딩 스피너
 * message가 있으면 스피너 하단에 문구를 함께 표시
 */
export const Spinner = ({ message, className = '', ...rest }: SpinnerProps) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        'flex w-full flex-col items-center justify-center gap-4 py-16',
        className
      )}
      {...rest}
    >
      <span
        aria-hidden
        className="size-10 animate-spin rounded-full border-[0.1875rem] border-line-100 border-t-blue-300"
      />
      {message ? (
        <p className="text-center text-lg-medium text-gray-400">{message}</p>
      ) : (
        <span className="sr-only">로딩 중</span>
      )}
    </div>
  );
};
