import { cn } from '@/lib/utils';

export interface ChatStartButtonContentProps {
  isPending?: boolean;
  className?: string;
}

/** 견적·요청 등 `채팅하기` CTA — pending 시 중앙 인라인 스피너만 표시 */
export const ChatStartButtonContent = ({
  isPending = false,
  className,
}: ChatStartButtonContentProps) => (
  <span className={cn('inline-flex items-center justify-center', className)}>
    {isPending ? (
      <>
        <span
          aria-hidden
          className="inline-block size-4 animate-spin rounded-full border-2 border-line-100 border-t-blue-300 motion-reduce:animate-none"
        />
        <span className="sr-only">채팅방 여는 중</span>
      </>
    ) : (
      '채팅하기'
    )}
  </span>
);
