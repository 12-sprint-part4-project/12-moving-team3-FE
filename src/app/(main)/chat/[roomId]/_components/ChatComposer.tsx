'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react';

import ChevronDownIcon from '@/assets/icons/chevron-down.svg';
import ClipIcon from '@/assets/icons/clip.svg';
import CloseIcon from '@/assets/icons/close.svg';
import SendIcon from '@/assets/icons/send.svg';
import {
  CHAT_MESSAGE_MAX_LENGTH,
  CHAT_MESSAGE_MAX_LENGTH_HINT,
} from '@/constants/chatUi';
import { useTranslation } from '@/i18n/useTranslation';
import {
  createPendingImageFiles,
  revokePendingImageFile,
  revokePendingImageFiles,
  type PendingImageFile,
} from '@/lib/pendingImagePreviews';
import {
  CHAT_IMAGE_LIMIT_HINT,
  CHAT_IMAGE_MAX_COUNT,
  validateChatImageFile,
} from '@/lib/uploadChatImage';
import { cn } from '@/lib/utils';

const CHAT_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp';

export type ChatScrollChipMode = 'hidden' | 'to-bottom' | 'new-message';

export interface ChatComposerProps {
  disabled?: boolean;
  /** disabled일 때 입력 영역 위에 표시할 안내 문구 */
  disabledReason?: string;
  isSending?: boolean;
  onSend: (content: string) => Promise<void> | void;
  onSendImages?: (files: File[]) => Promise<void> | void;
  focusInputSignal?: number;
  /**
   * 스크롤 안내 칩 모드
   * - `new-message`: 상대 새 메시지 도착
   * - `to-bottom`: 하단이 아닌 위치에서 최신으로 이동
   * - `hidden`: 미표시
   */
  scrollChipMode?: ChatScrollChipMode;
  /** 스크롤 안내 칩 탭 시 콜백 */
  onScrollChipClick?: () => void;
  /** Composer 높이 변화(이미지 미리보기·안내 문구) — 하단 고정 유지용 */
  onHeightChange?: () => void;
  className?: string;
}

/** 채팅방 하단 텍스트·이미지 입력·전송 */
export const ChatComposer = ({
  disabled = false,
  disabledReason,
  isSending = false,
  onSend,
  onSendImages,
  focusInputSignal = 0,
  scrollChipMode = 'hidden',
  onScrollChipClick,
  onHeightChange,
  className,
}: ChatComposerProps) => {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState('');
  const [pendingImages, setPendingImages] = useState<PendingImageFile[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingImagesRef = useRef(pendingImages);

  const trimmed = value.trim();
  const isAtMessageLimit = value.length >= CHAT_MESSAGE_MAX_LENGTH;
  const isOverMessageLimit = value.length > CHAT_MESSAGE_MAX_LENGTH;
  const hasPendingImages = pendingImages.length > 0;
  const isBusy = disabled || isSending;
  const canSend =
    !isBusy &&
    !isOverMessageLimit &&
    (trimmed.length > 0 || (hasPendingImages && Boolean(onSendImages)));

  const syncTextareaHeight = useCallback(() => {
    const el = inputRef.current;
    if (!el) {
      return;
    }

    const maxHeight = Number.parseFloat(window.getComputedStyle(el).maxHeight);
    if (!Number.isFinite(maxHeight)) {
      return;
    }

    el.style.height = 'auto';
    const nextHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, []);

  useEffect(() => {
    syncTextareaHeight();
  }, [value, syncTextareaHeight]);

  useEffect(() => {
    pendingImagesRef.current = pendingImages;
  }, [pendingImages]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !onHeightChange || typeof ResizeObserver === 'undefined') {
      return;
    }

    let lastHeight: number | null = null;
    const observer = new ResizeObserver((entries) => {
      const nextHeight = entries[0]?.contentRect.height;
      if (nextHeight == null) {
        return;
      }
      if (lastHeight == null) {
        lastHeight = nextHeight;
        return;
      }
      if (nextHeight === lastHeight) {
        return;
      }
      lastHeight = nextHeight;
      onHeightChange();
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [onHeightChange]);

  const clearPendingImages = () => {
    revokePendingImageFiles(pendingImages);
    setPendingImages([]);
    setImageError(null);
  };

  const submit = async () => {
    if (!canSend) {
      return;
    }

    if (hasPendingImages && onSendImages) {
      const files = pendingImages.map((item) => item.file);
      clearPendingImages();
      try {
        await onSendImages(files);
      } catch {
        setPendingImages(createPendingImageFiles(files));
        return;
      }
    }

    if (trimmed.length === 0) {
      return;
    }

    const content = trimmed;
    setValue('');
    try {
      await onSend(content);
    } catch {
      setValue((current) => (current.length === 0 ? content : current));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      if (!isOverMessageLimit) {
        void submit();
      }
    }
  };

  const handleValueChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value.slice(0, CHAT_MESSAGE_MAX_LENGTH));
  };

  const handleClipClick = () => {
    if (isBusy || !onSendImages) {
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (selected.length === 0) {
      return;
    }

    const validFiles: File[] = [];
    let firstError: string | null = null;
    for (const file of selected) {
      const errorMessage = validateChatImageFile(file);
      if (errorMessage) {
        firstError ??= errorMessage;
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      setImageError(firstError);
      return;
    }

    const newItems = createPendingImageFiles(validFiles);
    const combined = [...pendingImages, ...newItems];
    const isOverLimit = combined.length > CHAT_IMAGE_MAX_COUNT;
    if (isOverLimit) {
      const kept = combined.slice(0, CHAT_IMAGE_MAX_COUNT);
      revokePendingImageFiles(combined.slice(CHAT_IMAGE_MAX_COUNT));
      setPendingImages(kept);
      setImageError(t('chat.imageMax', { count: CHAT_IMAGE_MAX_COUNT }));
    } else {
      setPendingImages(combined);
      setImageError(firstError);
    }

    requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
  };

  const handleRemoveImage = (index: number) => {
    const removed = pendingImages[index];
    if (removed) {
      revokePendingImageFile(removed);
    }
    setPendingImages((current) => current.filter((_, i) => i !== index));
    setImageError(null);
  };

  useEffect(
    () => () => {
      revokePendingImageFiles(pendingImagesRef.current);
    },
    []
  );

  useEffect(() => {
    if (focusInputSignal === 0 || isBusy) {
      return;
    }

    // 문서 스크롤을 유발하지 않도록 preventScroll (#279)
    inputRef.current?.focus({ preventScroll: true });
  }, [focusInputSignal, isBusy]);

  const showImageLimitHint = hasPendingImages && imageError == null;
  const imageDescribedBy = [
    showImageLimitHint ? 'chat-composer-image-limit-hint' : null,
    imageError ? 'chat-composer-image-error' : null,
  ]
    .filter((id): id is string => id != null)
    .join(' ');

  return (
    <div ref={rootRef} className={cn('relative shrink-0', className)}>
      {scrollChipMode === 'new-message' ? (
        <div className="absolute -top-11 left-1/2 z-10 -translate-x-1/2">
          <button
            type="button"
            onClick={onScrollChipClick}
            className="flex cursor-pointer items-center gap-1 rounded-full bg-blue-300 px-3.5 py-2 text-sm-semibold text-white shadow-md transition-colors hover:bg-blue-200 active:bg-blue-200"
          >
            {t('chat.newMessage')}
            <ChevronDownIcon className="size-4" aria-hidden />
          </button>
        </div>
      ) : null}

      {scrollChipMode === 'to-bottom' ? (
        <div className="absolute -top-12 right-4 z-10 md:right-6">
          <button
            type="button"
            aria-label={t('chat.scrollToBottomAria')}
            onClick={onScrollChipClick}
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-line-200 bg-white text-gray-400 shadow-md transition-colors hover:bg-background-100 hover:text-blue-300 active:bg-background-100"
          >
            <ChevronDownIcon className="size-5" aria-hidden />
          </button>
        </div>
      ) : null}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 border-t border-line-100 bg-white px-4 py-3 md:px-6"
      >
        {disabled && disabledReason ? (
          <p className="text-sm-medium text-gray-300" role="status">
            {disabledReason}
          </p>
        ) : null}

        {hasPendingImages ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs-medium text-gray-400">
              {t('chat.attachedCount', { count: pendingImages.length })}
            </p>
            <ul
              className="flex min-h-19 gap-2 overflow-x-auto pt-2 pr-2 pb-1"
              aria-label={t('chat.attachPreviewAria')}
            >
              {pendingImages.map((item, index) => (
                <li
                  key={`${item.file.name}-${item.file.lastModified}-${index}`}
                  className="relative shrink-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="size-16 rounded-xl border border-line-200 object-cover"
                  />
                  <button
                    type="button"
                    aria-label={t('chat.deleteFileAria', {
                      name: item.file.name,
                    })}
                    disabled={isBusy}
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-1.5 -right-1.5 inline-flex size-5 cursor-pointer items-center justify-center rounded-full bg-black-400 text-white disabled:cursor-not-allowed"
                  >
                    <CloseIcon className="size-3" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
            {showImageLimitHint ? (
              <p
                id="chat-composer-image-limit-hint"
                className="text-xs-medium text-gray-300"
              >
                {CHAT_IMAGE_LIMIT_HINT}
              </p>
            ) : null}
          </div>
        ) : null}

        {imageError ? (
          <p
            id="chat-composer-image-error"
            className="text-sm-medium text-red-200"
            role="alert"
          >
            {imageError}
          </p>
        ) : null}

        {isAtMessageLimit ? (
          <p
            id="chat-composer-message-limit-hint"
            className="text-sm-medium text-red-200"
            role="alert"
          >
            {CHAT_MESSAGE_MAX_LENGTH_HINT}
          </p>
        ) : null}

        <div className="flex items-end gap-2.5">
          <input
            ref={fileInputRef}
            type="file"
            accept={CHAT_IMAGE_ACCEPT}
            multiple
            className="sr-only"
            aria-hidden
            tabIndex={-1}
            onChange={handleFileChange}
          />
          <button
            type="button"
            aria-label={t('chat.attachImageAria')}
            aria-describedby={imageDescribedBy || undefined}
            disabled={isBusy || !onSendImages}
            onClick={handleClipClick}
            className={cn(
              'inline-flex size-11 shrink-0 items-center justify-center transition-colors',
              isBusy || !onSendImages
                ? 'cursor-not-allowed text-gray-200'
                : 'cursor-pointer text-gray-300 hover:text-blue-300'
            )}
          >
            <ClipIcon className="size-9" aria-hidden />
          </button>
          <textarea
            ref={inputRef}
            rows={1}
            value={value}
            maxLength={CHAT_MESSAGE_MAX_LENGTH}
            onChange={handleValueChange}
            onKeyDown={handleKeyDown}
            disabled={isBusy}
            enterKeyHint="send"
            placeholder={
              disabled && disabledReason
                ? t('chat.cannotSendShort')
                : t('chat.placeholder')
            }
            aria-label={t('chat.inputAria')}
            aria-describedby={
              isAtMessageLimit ? 'chat-composer-message-limit-hint' : undefined
            }
            className={cn(
              'max-h-32 min-h-11 min-w-0 flex-1 resize-none rounded-2xl border border-line-200 bg-background-100 px-3.5 py-2.5 text-md-medium text-black-400 outline-none',
              '[scrollbar-width:none] overflow-hidden [&::-webkit-scrollbar]:hidden',
              'whitespace-pre-wrap',
              'placeholder:text-gray-300',
              'focus:border-blue-300',
              'disabled:cursor-not-allowed disabled:bg-background-200 disabled:text-gray-300'
            )}
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label={t('chat.sendAria')}
            className={cn(
              'inline-flex size-11 shrink-0 items-center justify-center transition-colors',
              canSend
                ? 'cursor-pointer text-blue-300 hover:text-blue-200'
                : 'cursor-not-allowed text-gray-200'
            )}
          >
            <SendIcon className="size-9" aria-hidden />
          </button>
        </div>
      </form>
    </div>
  );
};
