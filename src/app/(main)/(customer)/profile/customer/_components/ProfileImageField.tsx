'use client';

import Image from 'next/image';
import type { ChangeEvent, MouseEvent, ReactNode, RefObject } from 'react';

import CloseIcon from '@/assets/icons/close.svg';
import NoImageIcon from '@/assets/icons/no-image.svg';
import { cn } from '@/lib/utils';

interface ProfileImageFieldProps {
  imageInputId: string;
  imageInputRef: RefObject<HTMLInputElement | null>;
  displayImageUrl: string | null;
  labelClassName: string;
  /** 라벨 옆 필수/선택 표시 */
  labelExtra?: ReactNode;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onImageButtonClick: () => void;
  onImageClear: () => void;
  className?: string;
}

const isLocalPreviewUrl = (url: string): boolean =>
  url.startsWith('blob:') || url.startsWith('data:');

/** 프로필 이미지 업로드·미리보기·제거 UI */
export const ProfileImageField = ({
  imageInputId,
  imageInputRef,
  displayImageUrl,
  labelClassName,
  labelExtra,
  onImageChange,
  onImageButtonClick,
  onImageClear,
  className,
}: ProfileImageFieldProps) => {
  const handleClearClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onImageClear();
  };

  return (
    <section
      className={cn('flex flex-col items-start gap-4 lg:gap-6', className)}
    >
      <h2 className={cn(labelClassName, 'flex items-center gap-1.5')}>
        프로필 이미지
        {labelExtra}
      </h2>
      <input
        ref={imageInputRef}
        id={imageInputId}
        type="file"
        accept="image/*"
        aria-label="프로필 이미지 파일 선택"
        className="sr-only"
        onChange={onImageChange}
      />
      <div className="relative">
        <button
          type="button"
          onClick={onImageButtonClick}
          aria-label="프로필 이미지 업로드"
          className={cn(
            'relative flex size-[6.25rem] cursor-pointer items-center justify-center overflow-hidden rounded-md bg-background-200 lg:size-40',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300'
          )}
        >
          {displayImageUrl ? (
            isLocalPreviewUrl(displayImageUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element -- blob/data 미리보기는 next/image 미지원
              <img
                src={displayImageUrl}
                alt="프로필 이미지 미리보기"
                className="size-full object-cover"
              />
            ) : (
              <Image
                src={displayImageUrl}
                alt="프로필 이미지 미리보기"
                fill
                sizes="(min-width: 64rem) 160px, 100px"
                className="object-cover"
              />
            )
          ) : (
            <NoImageIcon
              className="size-8 text-gray-300 lg:size-10"
              aria-hidden
            />
          )}
        </button>

        {displayImageUrl ? (
          <button
            type="button"
            aria-label="프로필 이미지 제거"
            onClick={handleClearClick}
            className={cn(
              'absolute top-1 right-1 z-10 inline-flex size-5 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white',
              'lg:size-6',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300'
            )}
          >
            <CloseIcon className="size-3 lg:size-3.5" aria-hidden />
          </button>
        ) : null}
      </div>
    </section>
  );
};
