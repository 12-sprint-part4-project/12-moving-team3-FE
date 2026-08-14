'use client';

import { marked } from 'marked';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getCommunityWriteHtml } from '@/app/(main)/community/write/_components/communityWriteEditor';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import {
  getInitialWriteCategory,
  MAX_POST_IMAGE_COUNT,
} from '@/constants/communityOptions';
import { usePost } from '@/hooks/usePost';
import {
  useCreatePost,
  useUpdatePost,
  useUploadPostImage,
} from '@/hooks/usePostMutations';
import { useToast } from '@/hooks/useToast';
import { resolveApiErrorMessage } from '@/lib/apiClient';
import { isHtmlContent } from '@/lib/communityPostContent';
import {
  createExistingWriteImageItems,
  createPendingWriteImageItems,
  getWriteImagePreviewUrls,
  hasUnresolvedWriteImageItems,
  resolveWriteImageKeys,
  revokePendingWriteImageItems,
  type WriteImageItem,
} from '@/lib/communityWriteImageItems';
import { parsePositiveInt } from '@/lib/parsePositiveInt';
import { scheduleAppRouterReplace } from '@/lib/scheduleAppRouterNavigation';
import { cn } from '@/lib/utils';

import {
  COMMUNITY_DESKTOP_X,
  COMMUNITY_DETAIL_MAX_W,
  COMMUNITY_HEADER_X,
} from '../_components/communityLayout';
import { COMMUNITY_DETAIL_DIVIDER } from '../_components/communitySharedStyles';
import { CommunityWriteCategoryChips } from './_components/CommunityWriteCategoryChips';
import { CommunityWriteContentField } from './_components/CommunityWriteContentField';
import { CommunityWriteImageField } from './_components/CommunityWriteImageField';
import { CommunityWriteRegionChips } from './_components/CommunityWriteRegionChips';
import {
  COMMUNITY_WRITE_ACTIONS_CLASS,
  COMMUNITY_WRITE_CANCEL_BUTTON_CLASS,
  COMMUNITY_WRITE_FORM_GAP_CLASS,
  COMMUNITY_WRITE_HEADER_DIVIDER_MT_CLASS,
  COMMUNITY_WRITE_MAIN_CLASS,
  COMMUNITY_WRITE_PAGE_TITLE_CLASS,
  COMMUNITY_WRITE_SUBMIT_BUTTON_CLASS,
} from './_components/communityWriteStyles';
import { CommunityWriteTitleField } from './_components/CommunityWriteTitleField';

import type {
  CreatePostBody,
  PostCategory,
  PostDetail,
  Region,
  UpdatePostBody,
} from '@/types/community';
import type { Editor } from '@tiptap/react';

interface CommunityWriteFormProps {
  isEditMode: boolean;
  editPost: PostDetail | null;
  initialCategory: PostCategory;
  editPostId: number | null;
}

/** 작성·수정 폼 — editPost 기준 state 초기화 (effect hydration 없음) */
const CommunityWriteForm = ({
  isEditMode,
  editPost,
  initialCategory,
  editPostId,
}: CommunityWriteFormProps) => {
  const router = useRouter();
  const { showToast } = useToast();
  const { mutateAsync: createPost } = useCreatePost();
  const { mutateAsync: updatePost } = useUpdatePost(editPostId ?? 0);
  const { mutateAsync: uploadPostImage } = useUploadPostImage();

  const editInitialContent = useMemo(() => {
    if (!editPost) return '';
    const { content } = editPost;
    if (isHtmlContent(content)) return content;
    // Legacy Markdown: HTML로 변환해 Tiptap에 전달
    return String(marked.parse(content));
  }, [editPost]);

  const [category, setCategory] = useState<PostCategory>(
    () => editPost?.category ?? initialCategory
  );
  const [region, setRegion] = useState<Region | null>(
    () => editPost?.region ?? null
  );
  const [title, setTitle] = useState(() => editPost?.title ?? '');
  const [isContentEmpty, setIsContentEmpty] = useState(true);
  const [imageItems, setImageItems] = useState<WriteImageItem[]>(() =>
    editPost ? createExistingWriteImageItems(editPost.images) : []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contentEditorRef = useRef<Editor | null>(null);
  const imageItemsRef = useRef<WriteImageItem[]>(imageItems);
  const isSubmittedRef = useRef(false);

  useEffect(() => {
    imageItemsRef.current = imageItems;
  }, [imageItems]);

  useEffect(
    () => () => {
      revokePendingWriteImageItems(imageItemsRef.current);
    },
    []
  );

  const isDirty =
    title.trim().length > 0 || !isContentEmpty || imageItems.length > 0;

  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isSubmittedRef.current) return;
      event.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const imagePreviews = useMemo(
    () => getWriteImagePreviewUrls(imageItems),
    [imageItems]
  );

  const isFurnitureShare = category === 'FURNITURE_SHARE';

  const isSubmitDisabled = useMemo(() => {
    const trimmedTitleLength = title.trim().length;

    if (trimmedTitleLength === 0 || isContentEmpty) {
      return true;
    }

    if (isFurnitureShare && !isEditMode) {
      if (region === null || imageItems.length === 0) {
        return true;
      }
    }

    if (isEditMode && hasUnresolvedWriteImageItems(imageItems)) {
      return true;
    }

    return false;
  }, [imageItems, isContentEmpty, isEditMode, isFurnitureShare, region, title]);

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

    const nextItems = createPendingWriteImageItems(
      files.slice(0, remainingSlots)
    );

    setImageItems((previous) => [...previous, ...nextItems]);
  }, []);

  const handleRemoveImageAt = useCallback((index: number) => {
    const target = imageItemsRef.current[index];

    if (target?.kind === 'pending') {
      URL.revokeObjectURL(target.previewUrl);
    }

    setImageItems((previous) =>
      previous.filter((_, currentIndex) => currentIndex !== index)
    );
  }, []);

  const handleCancel = useCallback(() => {
    if (isEditMode && editPostId !== null) {
      router.push(`/community/${editPostId}`);
      return;
    }

    router.push('/community');
  }, [editPostId, isEditMode, router]);

  const handleEditorReady = useCallback((editor: Editor | null) => {
    contentEditorRef.current = editor;
    setIsContentEmpty(editor?.isEmpty ?? true);
  }, []);

  const handleEditorUpdate = useCallback((editor: Editor) => {
    setIsContentEmpty(editor.isEmpty);
  }, []);

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
      const imageKeys = await resolveWriteImageKeys(
        imageItems,
        uploadPostImage
      );

      if (isEditMode && editPostId !== null) {
        const body: UpdatePostBody = {
          content: getCommunityWriteHtml(editor),
          imageKeys,
        };

        await updatePost(body);

        isSubmittedRef.current = true;
        showToast({ content: '게시글이 수정되었습니다.' });
        router.push(`/community/${editPostId}`);
        return;
      }

      const body: CreatePostBody = {
        category,
        title: title.trim(),
        content: getCommunityWriteHtml(editor),
        ...(imageKeys.length > 0 ? { imageKeys } : {}),
        ...(category === 'FURNITURE_SHARE' && region !== null
          ? { region }
          : {}),
      };

      const response = await createPost(body);

      isSubmittedRef.current = true;
      showToast({ content: '게시글이 등록되었습니다.' });
      router.push(`/community/${response.data.id}`);
    } catch (error) {
      showToast({
        content:
          error instanceof Error && error.message === 'UNRESOLVED_POST_IMAGES'
            ? '기존 이미지 정보를 불러오지 못했습니다. 이미지를 다시 첨부해 주세요.'
            : resolveApiErrorMessage(
                error,
                isEditMode
                  ? '게시글 수정에 실패했습니다.'
                  : '게시글 등록에 실패했습니다.'
              ),
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    category,
    createPost,
    editPostId,
    imageItems,
    isEditMode,
    isSubmitDisabled,
    isSubmitting,
    region,
    router,
    showToast,
    title,
    updatePost,
    uploadPostImage,
  ]);

  return (
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
        readOnly={isEditMode}
      />

      {isFurnitureShare ? (
        <CommunityWriteRegionChips
          value={region}
          onChange={setRegion}
          readOnly={isEditMode}
        />
      ) : null}

      <CommunityWriteTitleField
        value={title}
        onChange={setTitle}
        readOnly={isEditMode}
      />

      <CommunityWriteContentField
        initialContent={isEditMode ? editInitialContent : ''}
        onEditorReady={handleEditorReady}
        onEditorUpdate={handleEditorUpdate}
      />

      <CommunityWriteImageField
        previews={imagePreviews}
        onAddFiles={handleAddFiles}
        onRemoveAt={handleRemoveImageAt}
        onImageError={handleImageError}
        requireAtLeastOne={isFurnitureShare && !isEditMode}
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
          {isSubmitting
            ? isEditMode
              ? '수정 중…'
              : '등록 중…'
            : isEditMode
              ? '수정'
              : '등록'}
        </button>
      </div>
    </form>
  );
};

/** 커뮤니티 게시글 작성 — Figma Mobile / Tablet / Desktop 15211:41641 */
export const CommunityWritePageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const hasForbiddenRedirectRef = useRef(false);

  const initialCategory = useMemo(
    () => getInitialWriteCategory(searchParams),
    [searchParams]
  );

  const editPostId = useMemo(
    () => parsePositiveInt(searchParams.get('postId')),
    [searchParams]
  );

  const isEditMode = editPostId !== null;

  const {
    data: editPost,
    isPending: isEditPostPending,
    isFetched: isEditPostFetched,
    isError: isEditPostError,
    error: editPostError,
  } = usePost(editPostId ?? 0);

  useEffect(() => {
    if (
      !isEditMode ||
      !isEditPostFetched ||
      !editPost ||
      editPost.isMine === true ||
      hasForbiddenRedirectRef.current
    ) {
      return;
    }

    hasForbiddenRedirectRef.current = true;
    showToast({ content: '본인 게시글만 수정할 수 있어요.' });
    scheduleAppRouterReplace(router, `/community/${editPost.id}`);
  }, [editPost, isEditMode, isEditPostFetched, router, showToast]);

  if (isEditMode && isEditPostFetched && editPost && editPost.isMine !== true) {
    return (
      <div className="flex justify-center py-24">
        <Spinner message="게시글로 이동 중..." />
      </div>
    );
  }

  if (isEditMode && isEditPostPending) {
    return (
      <div className="flex justify-center py-24">
        <Spinner message="게시글 불러오는 중..." />
      </div>
    );
  }

  if (isEditMode && (isEditPostError || !editPost)) {
    return (
      <div className="flex justify-center py-24">
        <p className="text-lg-medium text-gray-400">
          {resolveApiErrorMessage(
            editPostError,
            '게시글을 불러오지 못했습니다.'
          )}
        </p>
      </div>
    );
  }

  const formKey =
    isEditMode && editPost
      ? `edit-${editPost.id}`
      : `create-${initialCategory}`;

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
          <h2 className={COMMUNITY_WRITE_PAGE_TITLE_CLASS}>
            {isEditMode ? '게시글 수정' : '게시글 작성'}
          </h2>
          <div
            className={cn(
              COMMUNITY_DETAIL_DIVIDER,
              COMMUNITY_WRITE_HEADER_DIVIDER_MT_CLASS
            )}
            aria-hidden
          />
        </header>

        <CommunityWriteForm
          key={formKey}
          isEditMode={isEditMode}
          editPost={editPost ?? null}
          initialCategory={initialCategory}
          editPostId={editPostId}
        />
      </div>
    </div>
  );
};
