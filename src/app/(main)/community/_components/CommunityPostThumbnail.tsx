'use client';

import Image from 'next/image';
import { useState, type SyntheticEvent } from 'react';

import { cn } from '@/lib/utils';

const MOVING_LOGO_SRC = '/symbol.svg';

interface CommunityPostThumbnailProps {
  thumbnailUrl: string;
  className?: string;
}

const isBrokenImage = (image: HTMLImageElement): boolean =>
  image.naturalWidth === 0 || image.naturalHeight === 0;

/** presigned URL 로드 실패·손상 시 무빙 로고 fallback */
export const CommunityPostThumbnail = ({
  thumbnailUrl,
  className = '',
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
        'size-[4.5rem] shrink-0 overflow-hidden rounded-lg',
        'min-[46.5rem]:h-[5.5rem] min-[46.5rem]:w-[5.25rem]',
        'xl:h-[6.25rem] xl:w-[6.75rem]',
        hasError && 'flex items-center justify-center border border-line-200',
        className
      )}
    >
      {hasError ? (
        <Image
          src={MOVING_LOGO_SRC}
          alt=""
          width={32}
          height={32}
          className="size-8 object-contain opacity-40 min-[46.5rem]:size-10 xl:size-12"
        />
      ) : (
        <Image
          src={thumbnailUrl}
          alt=""
          width={108}
          height={100}
          unoptimized
          onError={handleError}
          onLoad={handleLoad}
          className="size-full object-cover"
        />
      )}
    </div>
  );
};
