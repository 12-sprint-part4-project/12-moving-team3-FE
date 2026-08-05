'use client';

import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type SyntheticEvent,
} from 'react';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import NoImageIcon from '@/assets/icons/no-image.svg';
import { cn } from '@/lib/utils';

import { CommunityPostImagePreviewModal } from './CommunityPostImagePreviewModal';

const MAX_POST_IMAGES = 5;
const THUMB_GAP_PX = 8;

const THUMB_BUTTON_CLASS =
  'size-[6.25rem] shrink-0 overflow-hidden rounded-lg bg-background-200 min-[46.5rem]:size-[12.5rem] min-[46.5rem]:rounded-xl xl:size-[18.75rem]';

const BROKEN_IMAGE_ICON_CLASS =
  'size-[1.5625rem] text-[#bbbbbb] min-[46.5rem]:size-[3.125rem] xl:size-[4.6875rem]';

interface CommunityPostDetailImagesProps {
  imageUrls: string[];
  className?: string;
}

const isBrokenImage = (image: HTMLImageElement): boolean =>
  image.naturalWidth === 0 || image.naturalHeight === 0;

/** 게시글 본문 이미지 — Mobile 100 / Tablet 200 / Desktop 300 썸네일 가로 나열 */
export const CommunityPostDetailImages = ({
  imageUrls,
  className = '',
}: CommunityPostDetailImagesProps) => {
  const visibleUrls = useMemo(
    () => imageUrls.slice(0, MAX_POST_IMAGES),
    [imageUrls]
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const [failedUrls, setFailedUrls] = useState<ReadonlySet<string>>(
    () => new Set()
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const validUrls = useMemo(
    () => visibleUrls.filter((url) => !failedUrls.has(url)),
    [visibleUrls, failedUrls]
  );

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    if (!element) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    setCanScrollLeft(element.scrollLeft > 1);
    setCanScrollRight(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 1
    );
  }, []);

  useEffect(() => {
    updateScrollState();

    const element = scrollRef.current;
    if (!element) {
      return;
    }

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(element);
    element.addEventListener('scroll', updateScrollState, { passive: true });

    return () => {
      resizeObserver.disconnect();
      element.removeEventListener('scroll', updateScrollState);
    };
  }, [visibleUrls, updateScrollState]);

  if (visibleUrls.length === 0) {
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

  const scrollThumbnails = (direction: 'left' | 'right') => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }

    const firstThumb = element.firstElementChild;
    const step =
      firstThumb instanceof HTMLElement
        ? firstThumb.offsetWidth + THUMB_GAP_PX
        : THUMB_GAP_PX;

    element.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <div className={cn('relative', className)}>
        <div
          ref={scrollRef}
          className={cn(
            'flex gap-2 overflow-x-auto scroll-smooth',
            '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          )}
          style={{ touchAction: 'pan-x' }}
        >
          {visibleUrls.map((url, index) => {
            const hasError = failedUrls.has(url);

            return (
              <button
                key={url}
                type="button"
                aria-label={`게시글 이미지 ${index + 1} 원본 보기`}
                onClick={() => {
                  if (!hasError) {
                    setPreviewUrl(url);
                  }
                }}
                disabled={hasError}
                className={cn(
                  THUMB_BUTTON_CLASS,
                  hasError && 'flex items-center justify-center'
                )}
              >
                {hasError ? (
                  <NoImageIcon
                    className={BROKEN_IMAGE_ICON_CLASS}
                    aria-hidden
                  />
                ) : (
                  <Image
                    src={url}
                    alt=""
                    width={300}
                    height={300}
                    unoptimized
                    onError={() => markFailed(url)}
                    onLoad={(event: SyntheticEvent<HTMLImageElement>) => {
                      if (isBrokenImage(event.currentTarget)) {
                        markFailed(url);
                      }
                    }}
                    className="size-full object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>

        {canScrollLeft ? (
          <button
            type="button"
            aria-label="이전 이미지 썸네일 보기"
            onClick={() => scrollThumbnails('left')}
            className={cn(
              'absolute top-1/2 left-0 z-10 inline-flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center',
              'rounded-full border border-line-200 bg-white shadow-request-card'
            )}
          >
            <ChevronLeftIcon className="size-4 text-black-400" aria-hidden />
          </button>
        ) : null}

        {canScrollRight ? (
          <button
            type="button"
            aria-label="다음 이미지 썸네일 보기"
            onClick={() => scrollThumbnails('right')}
            className={cn(
              'absolute top-1/2 right-0 z-10 inline-flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center',
              'rounded-full border border-line-200 bg-white shadow-request-card'
            )}
          >
            <ChevronRightIcon className="size-4 text-black-400" aria-hidden />
          </button>
        ) : null}
      </div>

      {previewUrl ? (
        <CommunityPostImagePreviewModal
          imageUrls={validUrls}
          initialIndex={Math.max(0, validUrls.indexOf(previewUrl))}
          onClose={() => setPreviewUrl(null)}
        />
      ) : null}
    </>
  );
};
