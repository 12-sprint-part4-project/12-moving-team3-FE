import Link from 'next/link';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import { cn } from '@/lib/utils';

export interface ChatRoomHeaderPlaceholderProps {
  title: string;
  titleClassName?: string;
  className?: string;
}

/** 로딩·오류 등 채팅방 헤더 플레이스홀더 */
export const ChatRoomHeaderPlaceholder = ({
  title,
  titleClassName,
  className,
}: ChatRoomHeaderPlaceholderProps) => (
  <header
    className={cn(
      'flex w-full shrink-0 items-center gap-3 border-b border-line-100 bg-white px-4 py-3 md:px-6',
      className
    )}
  >
    <Link
      href="/chat"
      aria-label="채팅 목록으로"
      className="inline-flex size-6 shrink-0 items-center justify-center text-black-400"
    >
      <ChevronLeftIcon className="size-6" aria-hidden />
    </Link>
    <p className={cn('text-2lg-semibold', titleClassName)}>{title}</p>
  </header>
);
