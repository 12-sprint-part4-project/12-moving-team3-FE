'use client';

import Image from 'next/image';
import {
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from 'react';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import CloseIcon from '@/assets/icons/close.svg';
import { ChatMessageMenu } from '@/components/chat/ChatMessageMenu';
import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';
import { Modal } from '@/components/ui/Modal/Modal';
import { formatChatMessageTime } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types/chat';

export interface ChatMessageItemProps {
  message: ChatMessage;
  isMine: boolean;
  /** false면 시각 숨김 — 같은 보낸이·같은 분 연속 묶음의 중간 메시지 */
  showTime?: boolean;
  /** 상대 미읽음 — 시간 위에 `1` */
  showUnreadCount?: boolean;
  /** 상대가 내 마지막까지 읽음 — 마지막 메시지에만 `읽음` */
  showReadLabel?: boolean;
  /** 상대 메시지 신고 — 있으면 ⋯ 메뉴 노출 (내 메시지에는 전달하지 않음) */
  onReport?: () => void;
  className?: string;
}

interface ChatImageAttachmentsProps {
  attachments: string[];
  isMine: boolean;
  onSelectImage: (index: number) => void;
}

interface ChatImageLightboxProps {
  attachments: string[];
  initialIndex: number;
  onClose: () => void;
}

const SWIPE_THRESHOLD_PX = 48;

const getTextMessageBody = (message: ChatMessage): string => {
  const content = message.content.trim();
  if (message.isFiltered && !content) {
    return '필터링된 메시지입니다';
  }

  return content.length > 0 ? content : ' ';
};

const imageBubbleRadius = (isMine: boolean): string =>
  isMine
    ? 'rounded-tl-3xl rounded-br-3xl rounded-bl-3xl md:rounded-tl-[1.875rem] md:rounded-br-[1.875rem] md:rounded-bl-[1.875rem]'
    : 'rounded-tr-3xl rounded-br-3xl rounded-bl-3xl md:rounded-tr-[1.875rem] md:rounded-br-[1.875rem] md:rounded-bl-[1.875rem]';

const ChatImageAttachments = ({
  attachments,
  isMine,
  onSelectImage,
}: ChatImageAttachmentsProps) => {
  const count = attachments.length;
  const isSingle = count === 1;

  return (
    <div
      className={cn(
        'overflow-hidden bg-line-100',
        imageBubbleRadius(isMine),
        isSingle ? 'w-[15rem]' : 'w-[18rem]'
      )}
    >
      <div
        className={cn(
          'grid w-full gap-0.5',
          isSingle ? 'grid-cols-1' : 'grid-cols-2'
        )}
      >
        {attachments.map((url, index) => (
          <button
            type="button"
            key={`${url}-${index}`}
            className="relative aspect-square cursor-pointer overflow-hidden bg-background-200 transition-opacity hover:opacity-95"
            onClick={() => onSelectImage(index)}
            aria-label={`${index + 1}번째 이미지 크게 보기`}
          >
            <Image
              src={url}
              alt={`사진 ${index + 1}`}
              fill
              sizes={isSingle ? '240px' : '144px'}
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

/** 채팅 이미지 확대 — 2장 이상이면 좌우 이동 */
const ChatImageLightbox = ({
  attachments,
  initialIndex,
  onClose,
}: ChatImageLightboxProps) => {
  const count = attachments.length;
  const [index, setIndex] = useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(count - 1, 0))
  );
  const touchStartXRef = useRef<number | null>(null);

  const canGoPrev = count > 1 && index > 0;
  const canGoNext = count > 1 && index < count - 1;
  const currentUrl = attachments[index] ?? attachments[0] ?? '';

  const goPrev = () => {
    setIndex((current) => Math.max(0, current - 1));
  };

  const goNext = () => {
    setIndex((current) => Math.min(count - 1, current + 1));
  };

  useEffect(() => {
    if (count <= 1) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setIndex((current) => Math.max(0, current - 1));
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setIndex((current) => Math.min(count - 1, current + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [count]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current;
    touchStartXRef.current = null;
    if (startX == null || count <= 1) {
      return;
    }

    const endX = event.changedTouches[0]?.clientX;
    if (endX == null) {
      return;
    }

    const deltaX = endX - startX;
    if (deltaX > SWIPE_THRESHOLD_PX) {
      goPrev();
    } else if (deltaX < -SWIPE_THRESHOLD_PX) {
      goNext();
    }
  };

  return (
    <Modal
      onClose={onClose}
      panelClassName="max-w-[90vw] overflow-visible bg-transparent sm:max-w-[90vw]"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="원본 이미지 보기"
        className="mx-auto flex w-full flex-col items-center gap-3 bg-transparent p-0 outline-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative inline-flex max-h-[85vh] max-w-full items-center justify-center">
          <button
            type="button"
            aria-label="이미지 닫기"
            onClick={onClose}
            className="absolute -top-1 -right-1 z-20 inline-flex size-12 items-center justify-center border-0 bg-transparent text-white outline-none focus:outline-none focus-visible:outline-none"
          >
            <CloseIcon
              className="size-7 drop-shadow-icon-on-media"
              aria-hidden
            />
          </button>

          {count > 1 ? (
            <button
              type="button"
              aria-label="이전 이미지"
              disabled={!canGoPrev}
              onClick={goPrev}
              className={cn(
                'absolute top-1/2 left-1 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-black-400/50 text-white outline-none focus:outline-none focus-visible:outline-none sm:size-11',
                canGoPrev
                  ? 'cursor-pointer hover:bg-black-400/70'
                  : 'cursor-not-allowed opacity-30'
              )}
            >
              <ChevronLeftIcon className="size-6 sm:size-7" aria-hidden />
            </button>
          ) : null}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUrl}
            alt={`확대된 이미지 ${index + 1}`}
            className="max-h-[85vh] w-auto max-w-full rounded-[1.5rem] object-contain select-none"
            draggable={false}
          />

          {count > 1 ? (
            <button
              type="button"
              aria-label="다음 이미지"
              disabled={!canGoNext}
              onClick={goNext}
              className={cn(
                'absolute top-1/2 right-1 z-10 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-black-400/50 text-white outline-none focus:outline-none focus-visible:outline-none sm:size-11',
                canGoNext
                  ? 'cursor-pointer hover:bg-black-400/70'
                  : 'cursor-not-allowed opacity-30'
              )}
            >
              <ChevronRightIcon className="size-6 sm:size-7" aria-hidden />
            </button>
          ) : null}
        </div>

        {count > 1 ? (
          <p
            className="text-md-medium text-white drop-shadow-icon-on-media"
            aria-live="polite"
          >
            {index + 1} / {count}
          </p>
        ) : null}
      </section>
    </Modal>
  );
};

/** 대화 말풍선 1건 — 나(오른쪽)·상대(왼쪽). 상대만 ⋯ 신고 메뉴 */
export const ChatMessageItem = ({
  message,
  isMine,
  showTime = true,
  showUnreadCount = false,
  showReadLabel = false,
  onReport,
  className,
}: ChatMessageItemProps) => {
  const isImageMessage =
    message.messageType === 'IMAGE' && message.attachments.length > 0;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const bubble = isImageMessage ? (
    <ChatImageAttachments
      attachments={message.attachments}
      isMine={isMine}
      onSelectImage={setLightboxIndex}
    />
  ) : (
    <TextFieldChat
      color={isMine ? 'mePrimary' : 'incoming'}
      className="px-3.5 py-2.5 drop-shadow-none md:px-3.5 md:py-2.5"
    >
      {message.messageType === 'IMAGE'
        ? '사진'
        : getTextMessageBody(message)}
    </TextFieldChat>
  );

  const timeLabel = showTime ? (
    <time
      dateTime={message.createdAt}
      className="whitespace-nowrap text-xs-medium text-gray-300"
    >
      {formatChatMessageTime(message.createdAt)}
    </time>
  ) : null;

  const mineMeta =
    isMine && (showUnreadCount || showReadLabel || showTime) ? (
      <div className="flex shrink-0 flex-col items-end justify-end gap-0.5 self-end">
        {showUnreadCount ? (
          <span className="text-xs-medium text-blue-300" aria-label="안 읽음">
            1
          </span>
        ) : null}
        {showReadLabel ? (
          <span className="text-xs-medium text-gray-300">읽음</span>
        ) : null}
        {timeLabel}
      </div>
    ) : null;

  const partnerMeta =
    !isMine && (onReport || timeLabel) ? (
      <div className="flex shrink-0 flex-col items-start justify-end gap-0 self-end ml-0.5">
        {onReport ? (
          <ChatMessageMenu onReport={onReport} className="-mb-0.5 -translate-x-0.5" />
        ) : null}
        {timeLabel}
      </div>
    ) : null;

  return (
    <>
      <div
        className={cn(
          'flex max-w-[75%] items-end gap-1.5',
          isMine ? 'flex-row self-end' : 'group/msg flex-row self-start',
          className
        )}
      >
        {/* 내 메시지: (1|읽음·시간) | 말풍선. 상대: 말풍선 | (⋯ / 시간) */}
        {mineMeta}
        <div className="min-w-0">{bubble}</div>
        {partnerMeta}
      </div>

      {lightboxIndex != null && isImageMessage ? (
        <ChatImageLightbox
          attachments={message.attachments}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </>
  );
};
