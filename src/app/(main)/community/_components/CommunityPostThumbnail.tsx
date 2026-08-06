'use client';

import Image from 'next/image';
import { useState, type SyntheticEvent } from 'react';

import NoImageIcon from '@/assets/icons/no-image.svg';
import { cn } from '@/lib/utils';

interface CommunityPostThumbnailProps {
  thumbnailUrl: string;
  className?: string;
  /** above-the-fold LCP — Next.js preload */
  preload?: boolean;
}

const isBrokenImage = (image: HTMLImageElement): boolean =>
  image.naturalWidth === 0 || image.naturalHeight === 0;

/** presigned URL 로드 실패·손상 시 no-image fallback */
export const CommunityPostThumbnail = ({
  thumbnailUrl,
  className = '',
  preload = false,
}: CommunityPostThumbnailProps) => {
  const [failedThumbnailUrl, setFailedThumbnailUrl] = useState<string | null>(
    null
  );
  const hasError = failedThumbnailUrl === thumbnailUrl;

  const handleError = () => {
    setFailedThumbnailUrl(thumbnailUrl);
  };

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    if (isBrokenImage(event.currentTarget)) {
      setFailedThumbnailUrl(thumbnailUrl);
    }
  };

  return (
    <div
      className={cn(
        'size-[4.5rem] shrink-0 overflow-hidden rounded-lg bg-background-200',
        'min-[46.5rem]:h-[5.5rem] min-[46.5rem]:w-[5.25rem]',
        'xl:h-[6.25rem] xl:w-[6.75rem]',
        hasError && 'flex items-center justify-center',
        className
      )}
    >
      {hasError ? (
        <NoImageIcon
          className="size-6 text-gray-200 min-[46.5rem]:size-7 xl:size-8"
          aria-hidden
        />
      ) : (
        <Image
          src={thumbnailUrl}
          alt=""
          width={108}
          height={100}
          unoptimized
          preload={preload}
          onError={handleError}
          onLoad={handleLoad}
          className="size-full object-cover"
        />
      )}
    </div>
  );
};
