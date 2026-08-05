'use client';

import Image from 'next/image';
import { useState } from 'react';

import CloseIcon from '@/assets/icons/close.svg';
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
  className?: string;
}

interface ChatImageAttachmentsProps {
  attachments: string[];
  isMine: boolean;
  onSelectImage: (imageUrl: string) => void;
}

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
            onClick={() => onSelectImage(url)}
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

/** 대화 말풍선 1건 — 나(오른쪽)·상대(왼쪽) */
export const ChatMessageItem = ({
  message,
  isMine,
  showTime = true,
  className,
}: ChatMessageItemProps) => {
  const isImageMessage =
    message.messageType === 'IMAGE' && message.attachments.length > 0;
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const bubble = isImageMessage ? (
    <ChatImageAttachments
      attachments={message.attachments}
      isMine={isMine}
      onSelectImage={setSelectedImageUrl}
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
      className="shrink-0 self-end whitespace-nowrap text-xs-medium text-gray-300"
    >
      {formatChatMessageTime(message.createdAt)}
    </time>
  ) : null;

  return (
    <>
      <div
        className={cn(
          'flex max-w-[75%] items-end gap-1.5',
          isMine ? 'flex-row self-end' : 'flex-row self-start',
          className
        )}
      >
        {/* 내 메시지: 시간 | 말풍선 (왼쪽 하단). 상대: 말풍선 | 시간 */}
        {isMine ? timeLabel : null}
        <div className="min-w-0">{bubble}</div>
        {!isMine ? timeLabel : null}
      </div>

      {selectedImageUrl ? (
        <Modal
          onClose={() => setSelectedImageUrl(null)}
          panelClassName="max-w-[90vw] bg-transparent sm:max-w-[90vw]"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="원본 이미지 보기"
            className="mx-auto flex w-full items-center justify-center bg-transparent p-0 outline-none"
          >
            <div className="relative inline-flex max-h-[85vh] max-w-full">
              <button
                type="button"
                aria-label="이미지 닫기"
                onClick={() => setSelectedImageUrl(null)}
                className="absolute -top-1 -right-1 z-10 inline-flex size-12 items-center justify-center text-white"
              >
                <CloseIcon
                  className="size-7 drop-shadow-icon-on-media"
                  aria-hidden
                />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImageUrl}
                alt="확대된 이미지"
                className="max-h-[85vh] w-auto max-w-full rounded-[1.5rem] object-contain"
              />
            </div>
          </section>
        </Modal>
      ) : null}
    </>
  );
};
