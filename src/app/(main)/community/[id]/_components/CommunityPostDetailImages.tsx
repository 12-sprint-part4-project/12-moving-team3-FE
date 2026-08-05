'use client';

import Image from 'next/image';
import { useState, type SyntheticEvent } from 'react';

import { cn } from '@/lib/utils';

const MOVING_LOGO_SRC = '/symbol.svg';

interface CommunityPostDetailImagesProps {
  imageUrls: string[];
  className?: string;
}

const isBrokenImage = (image: HTMLImageElement): boolean =>
  image.naturalWidth === 0 || image.naturalHeight === 0;

/** 게시글 본문 이미지 — presigned URL 실패 시 로고 fallback */
export const CommunityPostDetailImages = ({
  imageUrls,
  className = '',
}: CommunityPostDetailImagesProps) => {
  const [failedUrls, setFailedUrls] = useState<ReadonlySet<string>>(
    () => new Set()
  );

  if (imageUrls.length === 0) {
    return null;
  }

  const markFailed = (url: string) => {
    setFailedUrls((prev) => {
      if (prev.has(url)) {
        return prev;
      }
      return new Set(prev).add(url);
    });
  };

  const handleError =
    (url: string) => (): void => {
      markFailed(url);
    };

  const handleLoad =
    (url: string) =>
    (event: SyntheticEvent<HTMLImageElement>): void => {
      if (isBrokenImage(event.currentTarget)) {
        markFailed(url);
      }
    };

  return (
    <div className={cn('flex flex-col gap-3 min-[46.5rem]:gap-4 xl:gap-6', className)}>
      {imageUrls.map((url) => {
        const hasError = failedUrls.has(url);

        return (
          <div
            key={url}
            className={cn(
              'relative w-full overflow-hidden rounded-lg bg-background-200',
              'min-[46.5rem]:rounded-xl xl:rounded-2xl',
              hasError && 'flex min-h-[12.5rem] items-center justify-center'
            )}
          >
            {hasError ? (
              <Image
                src={MOVING_LOGO_SRC}
                alt=""
                width={48}
                height={48}
                className="size-12 object-contain opacity-40"
              />
            ) : (
              <Image
                src={url}
                alt=""
                width={900}
                height={600}
                unoptimized
                onError={handleError(url)}
                onLoad={handleLoad(url)}
                className="h-auto w-full object-cover"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
