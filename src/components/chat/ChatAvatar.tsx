import Image from 'next/image';

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
          'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-background-200',
          className
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="56px"
          className="object-cover object-center"
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
