'use client';

import Image from 'next/image';
import { type ChangeEvent, useRef } from 'react';

import CloseIcon from '@/assets/icons/close.svg';

import {
  COMMUNITY_WRITE_HINT_CLASS,
  COMMUNITY_WRITE_IMAGE_ADD_BUTTON_CLASS,
  COMMUNITY_WRITE_IMAGE_THUMB_CLASS,
  COMMUNITY_WRITE_LABEL_CLASS,
} from './communityWriteStyles';

const MAX_IMAGES = 5;

interface CommunityWriteImageFieldProps {
  previews: string[];
  onAddFiles: (files: File[]) => void;
  onRemoveAt: (index: number) => void;
  requireAtLeastOne?: boolean;
  className?: string;
}

/** 게시글 이미지 업로드 — 80×80 썸네일 (Figma 15211:41641) */
export const CommunityWriteImageField = ({
  previews,
  onAddFiles,
  onRemoveAt,
  requireAtLeastOne = false,
  className = '',
}: CommunityWriteImageFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const canAddMore = previews.length < MAX_IMAGES;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (files.length === 0) {
      return;
    }

    const remainingSlots = MAX_IMAGES - previews.length;
    onAddFiles(files.slice(0, remainingSlots));
  };

  return (
    <section className={className}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
        <h2 className={COMMUNITY_WRITE_LABEL_CLASS}>이미지</h2>
        {requireAtLeastOne ? (
          <p className={COMMUNITY_WRITE_HINT_CLASS}>
            가구나눔 작성 시 이미지를 1장 이상 첨부해 주세요.
          </p>
        ) : null}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-2">
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
              accept="image/*"
              multiple
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
    </section>
  );
};
