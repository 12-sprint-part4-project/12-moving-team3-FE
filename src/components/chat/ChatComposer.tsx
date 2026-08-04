'use client';

import { useState, type FormEvent, type KeyboardEvent } from 'react';

import SendIcon from '@/assets/icons/send.svg';

import { cn } from '@/lib/utils';

export interface ChatComposerProps {
  disabled?: boolean;
  isSending?: boolean;
  onSend: (content: string) => Promise<void> | void;
  className?: string;
}

/** 채팅방 하단 텍스트 입력·전송 (Phase 2 — 첨부 없음) */
export const ChatComposer = ({
  disabled = false,
  isSending = false,
  onSend,
  className,
}: ChatComposerProps) => {
  const [value, setValue] = useState('');

  const trimmed = value.trim();
  const canSend = !disabled && !isSending && trimmed.length > 0;

  const submit = async () => {
    if (!canSend) {
      return;
    }

    const content = trimmed;
    setValue('');
    try {
      await onSend(content);
    } catch {
      setValue(content);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex shrink-0 items-center gap-2.5 border-t border-line-100 bg-white px-4 py-3 md:px-6',
        className
      )}
    >
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isSending}
        placeholder="메시지를 입력하세요"
        aria-label="메시지 입력"
        className={cn(
          'min-w-0 flex-1 rounded-full border border-line-200 bg-background-100 px-3.5 py-2.5 text-md-medium text-black-400 outline-none',
          'placeholder:text-gray-300',
          'focus:border-blue-300',
          'disabled:cursor-not-allowed disabled:bg-background-200 disabled:text-gray-300'
        )}
      />
      <button
        type="submit"
        disabled={!canSend}
        aria-label="전송"
        className={cn(
          'inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors',
          canSend
            ? 'cursor-pointer bg-blue-300 text-white hover:bg-blue-200'
            : 'cursor-not-allowed bg-gray-100 text-white'
        )}
      >
        <SendIcon className="size-5" aria-hidden />
      </button>
    </form>
  );
};
