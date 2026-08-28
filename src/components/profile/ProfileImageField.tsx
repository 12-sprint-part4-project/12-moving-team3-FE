'use client';

import Image from 'next/image';

import CloseIcon from '@/assets/icons/close.svg';
import NoImageIcon from '@/assets/icons/no-image.svg';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import type { ChangeEvent, MouseEvent, RefObject } from 'react';

interface ProfileImageFieldProps {
  imageInputId: string;
  imageInputRef: RefObject<HTMLInputElement | null>;
  displayImageUrl: string | null;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onImageButtonClick: () => void;
  onImageClear: () => void;
  labelClassName?: string;
  className?: string;
}

/** blob/data URL은 next/image가 다루지 못해 img로 미리본다 */
const isLocalPreviewUrl = (url: string): boolean =>
  url.startsWith('blob:') || url.startsWith('data:');

/** 프로필 이미지 업로드·미리보기·제거 필드 */
export const ProfileImageField = ({
  imageInputId,
  imageInputRef,
  displayImageUrl,
  onImageChange,
  onImageButtonClick,
  onImageClear,
  labelClassName = '',
  className = '',
}: ProfileImageFieldProps) => {
  const { t } = useTranslation();
  const handleClearClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onImageClear();
  };

  return (
    <section
      className={cn('flex flex-col items-start gap-4 lg:gap-6', className)}
    >
      <h2
        className={cn(
          'text-lg-semibold text-black-300 lg:text-xl-semibold',
          labelClassName
        )}
      >
        {t('profile.image')}
      </h2>
      <input
        ref={imageInputRef}
        id={imageInputId}
        type="file"
        accept="image/*"
        aria-label={t('profile.imageSelectAria')}
        className="sr-only"
        onChange={onImageChange}
      />
      <div className="relative">
        <button
          type="button"
          onClick={onImageButtonClick}
          aria-label={t('profile.imageUploadAria')}
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
                alt={t('profile.imagePreviewAlt')}
                className="size-full object-cover"
              />
            ) : (
              <Image
                src={displayImageUrl}
                alt={t('profile.imagePreviewAlt')}
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
            aria-label={t('profile.imageRemoveAria')}
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
