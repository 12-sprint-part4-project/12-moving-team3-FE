'use client';

import type { Editor } from '@tiptap/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  DEFAULT_WRITE_CATEGORY,
  MAX_POST_IMAGE_COUNT,
  MAX_POST_TITLE_LENGTH,
} from '@/constants/communityOptions';
import { useCreatePost, useUploadPostImage } from '@/hooks/useCommunity';
import { useToast } from '@/hooks/useToast';
import { resolveApiErrorMessage } from '@/lib/apiClient';
import {
  createPendingImageFiles,
  revokePendingImageFile,
  revokePendingImageFiles,
  type PendingImageFile,
} from '@/lib/pendingImagePreviews';
import { cn } from '@/lib/utils';
import type { CreatePostBody, PostCategory, Region } from '@/types/community';

import { COMMUNITY_DETAIL_DIVIDER } from '../_components/communitySharedStyles';
import {
  COMMUNITY_DESKTOP_X,
  COMMUNITY_DETAIL_MAX_W,
  COMMUNITY_HEADER_X,
} from '../_components/communityLayout';
import { CommunityWriteCategoryChips } from './_components/CommunityWriteCategoryChips';
import { CommunityWriteContentField } from './_components/CommunityWriteContentField';
import { CommunityWriteImageField } from './_components/CommunityWriteImageField';
import { CommunityWriteRegionChips } from './_components/CommunityWriteRegionChips';
import { CommunityWriteTitleField } from './_components/CommunityWriteTitleField';
import {
  COMMUNITY_WRITE_ACTIONS_CLASS,
  COMMUNITY_WRITE_CANCEL_BUTTON_CLASS,
  COMMUNITY_WRITE_FORM_GAP_CLASS,
  COMMUNITY_WRITE_HEADER_DIVIDER_MT_CLASS,
  COMMUNITY_WRITE_MAIN_CLASS,
  COMMUNITY_WRITE_PAGE_TITLE_CLASS,
  COMMUNITY_WRITE_SUBMIT_BUTTON_CLASS,
} from './_components/communityWriteStyles';

/** 커뮤니티 게시글 작성 — Figma Mobile / Tablet / Desktop 15211:41641 */
export const CommunityWritePageClient = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { mutateAsync: createPost } = useCreatePost();
  const { mutateAsync: uploadPostImage } = useUploadPostImage();

  const [category, setCategory] = useState<PostCategory>(DEFAULT_WRITE_CATEGORY);
  const [region, setRegion] = useState<Region | null>(null);
  const [title, setTitle] = useState('');
  const [isContentEmpty, setIsContentEmpty] = useState(true);
  const [imageItems, setImageItems] = useState<PendingImageFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contentEditorRef = useRef<Editor | null>(null);
  const imageItemsRef = useRef<PendingImageFile[]>([]);

  useEffect(() => {
    imageItemsRef.current = imageItems;
  }, [imageItems]);

  const imagePreviews = useMemo(
    () => imageItems.map((item) => item.previewUrl),
    [imageItems]
  );

  const isFurnitureShare = category === 'FURNITURE_SHARE';

  const isSubmitDisabled = useMemo(() => {
    const trimmedTitleLength = title.trim().length;

    if (
      trimmedTitleLength === 0 ||
      trimmedTitleLength > MAX_POST_TITLE_LENGTH ||
      isContentEmpty
    ) {
      return true;
    }

    if (isFurnitureShare) {
      if (region === null || imageItems.length === 0) {
        return true;
      }
    }

    return false;
  }, [imageItems.length, isContentEmpty, isFurnitureShare, region, title]);

  useEffect(
    () => () => {
      revokePendingImageFiles(imageItemsRef.current);
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
    const remainingSlots = MAX_POST_IMAGE_COUNT - imageItemsRef.current.length;

    if (remainingSlots <= 0) {
      return;
    }

    const nextItems = createPendingImageFiles(files.slice(0, remainingSlots));

    setImageItems((previous) => [...previous, ...nextItems]);
  }, []);

  const handleRemoveImageAt = useCallback((index: number) => {
    const target = imageItemsRef.current[index];

    if (target) {
      revokePendingImageFile(target);
    }

    setImageItems((previous) =>
      previous.filter((_, currentIndex) => currentIndex !== index)
    );
  }, []);

  const handleCancel = useCallback(() => {
    router.push('/community');
  }, [router]);

  const handleEditorReady = useCallback((editor: Editor | null) => {
    contentEditorRef.current = editor;
    setIsContentEmpty(editor?.isEmpty ?? true);
  }, []);

  const handleEditorUpdate = useCallback((editor: Editor) => {
    setIsContentEmpty(editor.isEmpty);
  }, []);

  const handleLinkError = useCallback(
    (message: string) => {
      showToast({ content: message });
    },
    [showToast]
  );

  const handleImageError = useCallback(
    (message: string) => {
      showToast({ content: message });
    },
    [showToast]
  );

  const handleSubmit = useCallback(async () => {
    if (isSubmitDisabled || isSubmitting) {
      return;
    }

    const editor = contentEditorRef.current;

    if (editor === null || editor.isEmpty) {
      return;
    }

    setIsSubmitting(true);

    try {
      const imageKeys = await Promise.all(
        imageItems.map((item) => uploadPostImage(item.file))
      );

      const body: CreatePostBody = {
        category,
        title: title.trim(),
        content: editor.getMarkdown(),
        ...(imageKeys.length > 0 ? { imageKeys } : {}),
        ...(category === 'FURNITURE_SHARE' && region !== null
          ? { region }
          : {}),
      };

      const response = await createPost(body);

      showToast({ content: '게시글이 등록되었습니다.' });
      router.push(`/community/${response.data.id}`);
    } catch (error) {
      showToast({
        content: resolveApiErrorMessage(error, '게시글 등록에 실패했습니다.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    category,
    createPost,
    imageItems,
    isSubmitDisabled,
    isSubmitting,
    region,
    router,
    showToast,
    title,
    uploadPostImage,
  ]);

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
          <h2 className={COMMUNITY_WRITE_PAGE_TITLE_CLASS}>게시글 작성</h2>
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
            void handleSubmit();
          }}
        >
          <CommunityWriteCategoryChips
            value={category}
            onChange={handleCategoryChange}
          />

          {isFurnitureShare ? (
            <CommunityWriteRegionChips value={region} onChange={setRegion} />
          ) : null}

          <CommunityWriteTitleField value={title} onChange={setTitle} />

          <CommunityWriteContentField
            onEditorReady={handleEditorReady}
            onEditorUpdate={handleEditorUpdate}
            onLinkError={handleLinkError}
          />

          <CommunityWriteImageField
            previews={imagePreviews}
            onAddFiles={handleAddFiles}
            onRemoveAt={handleRemoveImageAt}
            onImageError={handleImageError}
            requireAtLeastOne={isFurnitureShare}
          />

          <div className={COMMUNITY_DETAIL_DIVIDER} aria-hidden />

          <div className={COMMUNITY_WRITE_ACTIONS_CLASS}>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className={COMMUNITY_WRITE_CANCEL_BUTTON_CLASS}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled || isSubmitting}
              className={COMMUNITY_WRITE_SUBMIT_BUTTON_CLASS}
            >
              {isSubmitting ? '등록 중…' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
