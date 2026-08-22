import Link from 'next/link';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

export interface ChatRoomHeaderPlaceholderProps {
  /** loading: 상대 아바타·이름 스켈레톤 / error: 고정 타이틀 */
  variant?: 'loading' | 'error';
  title?: string;
  titleClassName?: string;
  className?: string;
}

/** 로딩·오류 등 채팅방 헤더 플레이스홀더 */
export const ChatRoomHeaderPlaceholder = ({
  variant = 'error',
  title,
  titleClassName,
  className,
}: ChatRoomHeaderPlaceholderProps) => {
  const { t } = useTranslation();
  const heading = title ?? t('chat.room');

  return (
    <header
      className={cn(
        'relative flex w-full shrink-0 items-center justify-between border-b border-line-100 bg-white px-4 py-3 md:px-6',
        className
      )}
      {...(variant === 'loading'
        ? {
            role: 'status' as const,
            'aria-busy': true,
            'aria-label': t('chat.roomLoadingAria'),
          }
        : {})}
    >
      <Link
        href="/chat"
        aria-label={t('chat.backToListAria')}
        className="z-10 inline-flex size-6 shrink-0 items-center justify-center text-black-400"
      >
        <ChevronLeftIcon className="size-6" aria-hidden />
      </Link>

      {variant === 'loading' ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 flex items-center justify-center gap-1.5 px-14"
        >
          <div className="size-9 shrink-0 animate-pulse rounded-full bg-background-200 motion-reduce:animate-none" />
          <div className="h-6 w-28 animate-pulse rounded bg-background-200 motion-reduce:animate-none sm:w-36" />
        </div>
      ) : (
        <p
          className={cn(
            'absolute inset-x-0 truncate px-14 text-center text-2lg-semibold',
            titleClassName ?? 'text-black-400'
          )}
        >
          {heading}
        </p>
      )}

      <div aria-hidden className="z-10 size-6 shrink-0" />
    </header>
  );
};
