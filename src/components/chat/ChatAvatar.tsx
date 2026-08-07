import ProfileIcon from '@/assets/icons/profile.svg';

import { cn } from '@/lib/utils';

export interface ChatAvatarProps {
  src?: string | null;
  alt?: string;
  className?: string;
}

/** 채팅 상대/본인 아바타 (GNB·MoverCard와 동일 rounded-full 패턴) */
export const ChatAvatar = ({
  src,
  alt = '',
  className,
}: ChatAvatarProps) => {
  if (src) {
    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-background-200',
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- 공개/CDN 프로필 URL */}
        <img
          src={src}
          alt={alt}
          className="size-full object-cover object-center"
        />
      </span>
    );
  }

  return (
    <ProfileIcon
      className={cn('block shrink-0 text-gray-200', className)}
      aria-hidden
    />
  );
};
