'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  getDefaultWriteCategory,
  parseCommunityTabId,
  type CommunityTabId,
} from '@/constants/communityOptions';
import type { PostCategory } from '@/types/community';

import { COMMUNITY_DETAIL_DIVIDER } from '../[id]/_components/communityDetailStyles';
import { COMMUNITY_PAGE_SHELL } from '../_components/communityLayout';
import { CommunityTabBar } from '../_components/CommunityTabBar';
import { CommunityWriteCategoryChips } from './_components/CommunityWriteCategoryChips';
import { CommunityWriteContentField } from './_components/CommunityWriteContentField';
import { CommunityWriteImageField } from './_components/CommunityWriteImageField';
import {
  COMMUNITY_WRITE_CANCEL_BUTTON_CLASS,
  COMMUNITY_WRITE_LABEL_CLASS,
  COMMUNITY_WRITE_SECTION_X,
  COMMUNITY_WRITE_SUBMIT_BUTTON_CLASS,
  COMMUNITY_WRITE_TITLE_INPUT_CLASS,
} from './_components/communityWriteStyles';

/** 커뮤니티 게시글 작성 — Figma Mobile 15211:41821 */
export const CommunityWritePageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = parseCommunityTabId(searchParams.get('tab'));

  const [activeTab, setActiveTab] = useState<CommunityTabId>(initialTab);
  const [category, setCategory] = useState<PostCategory>(() =>
    getDefaultWriteCategory(initialTab)
  );
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const imagePreviewsRef = useRef<string[]>([]);
  imagePreviewsRef.current = imagePreviews;

  const isSubmitDisabled = useMemo(
    () => title.trim().length === 0 || content.trim().length === 0,
    [content, title]
  );

  useEffect(
    () => () => {
      imagePreviewsRef.current.forEach((preview) =>
        URL.revokeObjectURL(preview)
      );
    },
    []
  );

  const handleTabChange = useCallback((tabId: CommunityTabId) => {
    setActiveTab(tabId);
    setCategory(getDefaultWriteCategory(tabId));
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
    <div className={COMMUNITY_PAGE_SHELL}>
      <CommunityTabBar activeTab={activeTab} onTabChange={handleTabChange} />

      <div className={`${COMMUNITY_WRITE_SECTION_X} pb-10 pt-6`}>
        <header>
          <h1 className="text-lg-bold text-black-400">게시글 작성</h1>
          <div
            className={`${COMMUNITY_DETAIL_DIVIDER} mt-4`}
            aria-hidden
          />
        </header>

        <form
          className="mt-6 flex flex-col gap-6"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <CommunityWriteCategoryChips
            activeTab={activeTab}
            value={category}
            onChange={setCategory}
          />

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
              className={`${COMMUNITY_WRITE_TITLE_INPUT_CLASS} mt-2.5`}
            />
          </section>

          <CommunityWriteContentField value={content} onChange={setContent} />

          <CommunityWriteImageField
            previews={imagePreviews}
            onAddFiles={handleAddFiles}
            onRemoveAt={handleRemoveImageAt}
          />

          <div className={COMMUNITY_DETAIL_DIVIDER} aria-hidden />

          <div className="flex gap-2">
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
