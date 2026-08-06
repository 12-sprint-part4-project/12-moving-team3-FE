'use client';

import Image from 'next/image';
import { type ChangeEvent, useRef } from 'react';

import CloseIcon from '@/assets/icons/close.svg';
import { MAX_POST_IMAGE_COUNT } from '@/constants/communityOptions';
import { validateChatImageFile } from '@/lib/uploadChatImage';
import { cn } from '@/lib/utils';

const POST_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp';

import {
  COMMUNITY_WRITE_FIELD_ROW_CLASS,
  COMMUNITY_WRITE_HINT_CLASS,
  COMMUNITY_WRITE_IMAGE_ADD_BUTTON_CLASS,
  COMMUNITY_WRITE_IMAGE_THUMB_CLASS,
  COMMUNITY_WRITE_LABEL_CLASS,
  COMMUNITY_WRITE_LABEL_ROW_CLASS,
} from './communityWriteStyles';

interface CommunityWriteImageFieldProps {
  previews: string[];
  onAddFiles: (files: File[]) => void;
  onRemoveAt: (index: number) => void;
  onImageError?: (message: string) => void;
  requireAtLeastOne?: boolean;
  className?: string;
}

/** 게시글 이미지 업로드 — 80×80 썸네일 (Figma 15211:41641) */
export const CommunityWriteImageField = ({
  previews,
  onAddFiles,
  onRemoveAt,
  onImageError,
  requireAtLeastOne = false,
  className = '',
}: CommunityWriteImageFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const canAddMore = previews.length < MAX_POST_IMAGE_COUNT;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (files.length === 0) {
      return;
    }

    const remainingSlots = MAX_POST_IMAGE_COUNT - previews.length;
    const validFiles: File[] = [];
    let firstError: string | null = null;

    if (files.length > remainingSlots) {
      firstError = `이미지는 최대 ${MAX_POST_IMAGE_COUNT}장까지 첨부할 수 있어요.`;
    }

    for (const file of files.slice(0, remainingSlots)) {
      const errorMessage = validateChatImageFile(file);

      if (errorMessage) {
        firstError ??= errorMessage;
        continue;
      }

      validFiles.push(file);
    }

    if (firstError) {
      onImageError?.(firstError);
    }

    if (validFiles.length > 0) {
      onAddFiles(validFiles);
    }
  };

  return (
    <section className={className}>
      <div className={COMMUNITY_WRITE_LABEL_ROW_CLASS}>
        <h2 className={COMMUNITY_WRITE_LABEL_CLASS}>이미지</h2>
        {requireAtLeastOne ? (
          <p className={COMMUNITY_WRITE_HINT_CLASS}>
            가구나눔 작성 시 이미지를 1장 이상 첨부해 주세요.
          </p>
        ) : null}
      </div>

      <div className={COMMUNITY_WRITE_FIELD_ROW_CLASS}>
        {previews.map((preview, index) => (
          <div key={preview} className={COMMUNITY_WRITE_IMAGE_THUMB_CLASS}>
            <Image
              src={preview}
              alt={`업로드 이미지 ${index + 1}`}
              fill
              unoptimized
              className="object-cover"
            />
            <button
              type="button"
              aria-label={`이미지 ${index + 1} 삭제`}
              onClick={() => onRemoveAt(index)}
              className="absolute top-1 right-1 inline-flex size-5 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white"
            >
              <CloseIcon className="size-3" aria-hidden />
            </button>
          </div>
        ))}

        {canAddMore ? (
          <>
            <input
              ref={inputRef}
              type="file"
              accept={POST_IMAGE_ACCEPT}
              multiple
              aria-label="이미지 파일 선택"
              className="sr-only"
              onChange={handleFileChange}
            />
            <button
              type="button"
              aria-label="이미지 추가"
              onClick={() => inputRef.current?.click()}
              className={COMMUNITY_WRITE_IMAGE_ADD_BUTTON_CLASS}
            >
              +
            </button>
          </>
        ) : null}
      </div>

      <p className={cn(COMMUNITY_WRITE_HINT_CLASS, 'mt-2')}>
        이미지는 최대 {MAX_POST_IMAGE_COUNT}장까지 첨부할 수 있어요.
      </p>
    </section>
  );
};
