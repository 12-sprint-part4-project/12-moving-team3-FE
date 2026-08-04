'use client';

import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';
import { formatChatMessageTime } from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types/chat';

export interface ChatMessageItemProps {
  message: ChatMessage;
  isMine: boolean;
  className?: string;
}

const getMessageBody = (message: ChatMessage): string => {
  if (message.messageType === 'IMAGE') {
    return '사진';
  }

  const content = message.content.trim();
  if (message.isFiltered && !content) {
    return '필터링된 메시지입니다';
  }

  return content.length > 0 ? content : ' ';
};

/** 대화 말풍선 1건 — 나(오른쪽)·상대(왼쪽) */
export const ChatMessageItem = ({
  message,
  isMine,
  className,
}: ChatMessageItemProps) => {
  return (
    <div
      className={cn(
        'flex max-w-[75%] flex-col gap-1',
        isMine ? 'self-end items-end' : 'self-start items-start',
        className
      )}
    >
      <TextFieldChat
        color={isMine ? 'mePrimary' : 'incoming'}
        className="px-3.5 py-2.5 drop-shadow-none md:px-3.5 md:py-2.5"
      >
        {getMessageBody(message)}
      </TextFieldChat>
      <time
        dateTime={message.createdAt}
        className="px-1 text-xs-medium text-gray-300"
      >
        {formatChatMessageTime(message.createdAt)}
      </time>
    </div>
  );
};
