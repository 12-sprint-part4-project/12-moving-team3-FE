'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import CloseIcon from '@/assets/icons/close.svg';
import { Modal } from '@/components/ui/Modal/Modal';
import { cn } from '@/lib/utils';

import { COMMUNITY_POST_IMAGE_PREVIEW_PANEL_CLASS } from './communityDetailStyles';

interface CommunityPostImagePreviewModalProps {
  imageUrls: string[];
  initialIndex: number;
  onClose: () => void;
  className?: string;
}

/** 게시글 이미지 원본 미리보기 */
export const CommunityPostImagePreviewModal = ({
  imageUrls,
  initialIndex,
  onClose,
  className = '',
}: CommunityPostImagePreviewModalProps) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const activeUrl = imageUrls[activeIndex];
  const hasMultiple = imageUrls.length > 1;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev <= 0 ? imageUrls.length - 1 : prev - 1));
  }, [imageUrls.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev >= imageUrls.length - 1 ? 0 : prev + 1));
  }, [imageUrls.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrev();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  if (!activeUrl) {
    return null;
  }

  const imageAlt =
    imageUrls.length > 1
      ? `게시글 이미지 ${activeIndex + 1}/${imageUrls.length}`
      : '게시글 이미지';

  return (
    <Modal
      onClose={onClose}
      ariaLabel="게시글 이미지 미리보기"
      className={cn('bg-black/80', className)}
      panelClassName={COMMUNITY_POST_IMAGE_PREVIEW_PANEL_CLASS}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="이미지 미리보기 닫기"
        className="absolute -top-2 -right-2 z-10 inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white sm:-top-3 sm:-right-3"
      >
        <CloseIcon className="size-6" aria-hidden />
      </button>

      <div className="relative flex items-center justify-center px-2 py-10 sm:px-10">
        {hasMultiple ? (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="이전 이미지"
            className="absolute left-0 z-10 inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white sm:left-2"
          >
            <ChevronLeftIcon className="size-6" aria-hidden />
          </button>
        ) : null}

        <Image
          src={activeUrl}
          alt={imageAlt}
          width={900}
          height={900}
          unoptimized
          className="max-h-[75vh] w-auto max-w-full object-contain"
        />

        {hasMultiple ? (
          <button
            type="button"
            onClick={handleNext}
            aria-label="다음 이미지"
            className="absolute right-0 z-10 inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white sm:right-2"
          >
            <ChevronRightIcon className="size-6" aria-hidden />
          </button>
        ) : null}
      </div>

      {hasMultiple ? (
        <p className="pb-4 text-center text-sm-medium text-white/80">
          {activeIndex + 1} / {imageUrls.length}
        </p>
      ) : null}
    </Modal>
  );
};
