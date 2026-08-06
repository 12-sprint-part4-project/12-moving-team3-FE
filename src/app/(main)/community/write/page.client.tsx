'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { DEFAULT_WRITE_CATEGORY } from '@/constants/communityOptions';
import { cn } from '@/lib/utils';
import type { PostCategory, Region } from '@/types/community';

import { COMMUNITY_DETAIL_DIVIDER } from '../(browse)/[id]/_components/communityDetailStyles';
import {
  COMMUNITY_DESKTOP_X,
  COMMUNITY_DETAIL_MAX_W,
  COMMUNITY_HEADER_X,
} from '../_components/communityLayout';
import { CommunityWriteCategoryChips } from './_components/CommunityWriteCategoryChips';
import { CommunityWriteContentField } from './_components/CommunityWriteContentField';
import { CommunityWriteImageField } from './_components/CommunityWriteImageField';
import { CommunityWriteRegionChips } from './_components/CommunityWriteRegionChips';
import {
  COMMUNITY_WRITE_ACTIONS_CLASS,
  COMMUNITY_WRITE_CANCEL_BUTTON_CLASS,
  COMMUNITY_WRITE_FORM_GAP_CLASS,
  COMMUNITY_WRITE_HEADER_DIVIDER_MT_CLASS,
  COMMUNITY_WRITE_LABEL_CLASS,
  COMMUNITY_WRITE_MAIN_CLASS,
  COMMUNITY_WRITE_PAGE_TITLE_CLASS,
  COMMUNITY_WRITE_SUBMIT_BUTTON_CLASS,
  COMMUNITY_WRITE_TITLE_INPUT_CLASS,
} from './_components/communityWriteStyles';

/** 커뮤니티 게시글 작성 — Figma Mobile / Tablet / Desktop 15211:41641 */
export const CommunityWritePageClient = () => {
  const router = useRouter();

  const [category, setCategory] = useState<PostCategory>(DEFAULT_WRITE_CATEGORY);
  const [region, setRegion] = useState<Region | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const imagePreviewsRef = useRef<string[]>([]);
  imagePreviewsRef.current = imagePreviews;

  const isFurnitureShare = category === 'FURNITURE_SHARE';

  const isSubmitDisabled = useMemo(() => {
    if (title.trim().length === 0 || content.trim().length === 0) {
      return true;
    }

    if (isFurnitureShare) {
      if (region === null || imagePreviews.length === 0) {
        return true;
      }
    }

    return false;
  }, [content, imagePreviews.length, isFurnitureShare, region, title]);

  useEffect(
    () => () => {
      imagePreviewsRef.current.forEach((preview) =>
        URL.revokeObjectURL(preview)
      );
    },
    []
  );

  const handleCategoryChange = useCallback((nextCategory: PostCategory) => {
    setCategory(nextCategory);

    if (nextCategory !== 'FURNITURE_SHARE') {
      setRegion(null);
    }
  }, []);

  const handleAddFiles = useCallback((files: File[]) => {
    const nextPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((previous) => [...previous, ...nextPreviews]);
  }, []);

  const handleRemoveImageAt = useCallback((index: number) => {
    setImagePreviews((previous) => {
      const target = previous[index];

      if (target) {
        URL.revokeObjectURL(target);
      }

      return previous.filter((_, currentIndex) => currentIndex !== index);
    });
  }, []);

  const handleCancel = useCallback(() => {
    router.push('/community');
  }, [router]);

  const handleSubmit = useCallback(() => {
    if (isSubmitDisabled) {
      return;
    }
  }, [isSubmitDisabled]);

  return (
    <div
      className={cn(
        COMMUNITY_HEADER_X,
        COMMUNITY_DESKTOP_X,
        COMMUNITY_WRITE_MAIN_CLASS
      )}
    >
      <div className={COMMUNITY_DETAIL_MAX_W}>
        <header>
          <h1 className={COMMUNITY_WRITE_PAGE_TITLE_CLASS}>게시글 작성</h1>
          <div
            className={cn(
              COMMUNITY_DETAIL_DIVIDER,
              COMMUNITY_WRITE_HEADER_DIVIDER_MT_CLASS
            )}
            aria-hidden
          />
        </header>

        <form
          className={COMMUNITY_WRITE_FORM_GAP_CLASS}
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <CommunityWriteCategoryChips
            value={category}
            onChange={handleCategoryChange}
          />

          {isFurnitureShare ? (
            <CommunityWriteRegionChips value={region} onChange={setRegion} />
          ) : null}

          <section>
            <h2 className={COMMUNITY_WRITE_LABEL_CLASS}>제목</h2>
            <label className="sr-only" htmlFor="community-write-title">
              게시글 제목
            </label>
            <input
              id="community-write-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="제목을 입력해 주세요."
              className={cn(COMMUNITY_WRITE_TITLE_INPUT_CLASS, 'mt-2.5')}
            />
          </section>

          <CommunityWriteContentField value={content} onChange={setContent} />

          <CommunityWriteImageField
            previews={imagePreviews}
            onAddFiles={handleAddFiles}
            onRemoveAt={handleRemoveImageAt}
            requireAtLeastOne={isFurnitureShare}
          />

          <div className={COMMUNITY_DETAIL_DIVIDER} aria-hidden />

          <div className={COMMUNITY_WRITE_ACTIONS_CLASS}>
            <button
              type="button"
              onClick={handleCancel}
              className={COMMUNITY_WRITE_CANCEL_BUTTON_CLASS}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={COMMUNITY_WRITE_SUBMIT_BUTTON_CLASS}
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
