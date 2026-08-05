'use client';

import { useCallback, useState } from 'react';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import CloseIcon from '@/assets/icons/close.svg';
import { Modal } from '@/components/ui/Modal/Modal';
import { cn } from '@/lib/utils';

interface CommunityPostImagePreviewModalProps {
  imageUrls: string[];
  initialIndex: number;
  onClose: () => void;
}

/** 게시글 이미지 원본 미리보기 */
export const CommunityPostImagePreviewModal = ({
  imageUrls,
  initialIndex,
  onClose,
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

  if (!activeUrl) {
    return null;
  }

  return (
    <Modal
      onClose={onClose}
      className="bg-black/80"
      panelClassName="relative max-w-[min(92vw,56.25rem)] bg-transparent shadow-none sm:max-w-[min(92vw,56.25rem)]"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="이미지 미리보기 닫기"
        className="absolute top-0 right-0 z-10 inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white"
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

        {/* eslint-disable-next-line @next/next/no-img-element -- Presigned URL */}
        <img
          src={activeUrl}
          alt=""
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
