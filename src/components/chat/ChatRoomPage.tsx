'use client';

import Link from 'next/link';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';

import { ChatAvatar } from '@/components/chat/ChatAvatar';
import { useAuth } from '@/hooks/useAuth';
import { useChatRoom } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

export interface ChatRoomPageProps {
  roomId: string;
  className?: string;
}

/**
 * Phase 1 채팅방 진입점.
 * 상세 대화 UI는 Phase 2에서 구현한다. 목록·드롭다운에서 네비게이션만 보장.
 */
export const ChatRoomPage = ({
  roomId: roomIdParam,
  className,
}: ChatRoomPageProps) => {
  const roomId = Number(roomIdParam);
  const isValidRoomId = Number.isFinite(roomId) && roomId > 0;

  const { user, isReady } = useAuth();
  const enabled = Boolean(isReady && user && isValidRoomId);
  const { room, isPending, isError } = useChatRoom(roomId, { enabled });

  if (!isReady) {
    return null;
  }

  if (!user) {
    return (
      <div
        className={cn(
          'mx-auto flex w-full max-w-[43rem] flex-col px-6 py-10',
          className
        )}
      >
        <h1 className="text-2xl-bold text-black-400">채팅</h1>
        <p className="mt-8 text-center text-lg-medium text-gray-300">
          로그인 후 채팅을 이용할 수 있어요
        </p>
      </div>
    );
  }

  if (!isValidRoomId) {
    return (
      <div
        className={cn(
          'mx-auto flex w-full max-w-[43rem] flex-col px-6 py-10',
          className
        )}
      >
        <Link
          href="/chat"
          className="inline-flex w-fit items-center gap-1 text-md-medium text-gray-400 hover:text-black-400"
        >
          <ChevronLeftIcon className="size-5" aria-hidden />
          채팅 목록
        </Link>
        <p className="mt-8 text-center text-lg-medium text-gray-300">
          존재하지 않는 채팅방이에요
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'mx-auto flex min-h-[50vh] w-full max-w-[43rem] flex-col',
        className
      )}
    >
      <header className="flex w-full items-center gap-3 border-b border-line-100 bg-white px-4 py-3 md:px-6">
        <Link
          href="/chat"
          aria-label="채팅 목록으로"
          className="inline-flex size-6 shrink-0 items-center justify-center text-black-400"
        >
          <ChevronLeftIcon className="size-6" aria-hidden />
        </Link>

        {isPending ? (
          <p className="text-2lg-semibold text-gray-300">불러오는 중…</p>
        ) : null}

        {!isPending && room ? (
          <>
            <ChatAvatar
              src={room.partner.profileImageUrl}
              alt=""
              className="size-9"
            />
            <p className="min-w-0 flex-1 truncate text-2lg-semibold text-black-400">
              {room.partner.nickname}
            </p>
          </>
        ) : null}

        {!isPending && (isError || !room) ? (
          <p className="text-2lg-semibold text-black-400">채팅방</p>
        ) : null}
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16">
        {isError ? (
          <p className="text-center text-lg-medium text-gray-300">
            채팅방을 불러오지 못했어요
          </p>
        ) : (
          <p className="text-center text-lg-medium text-gray-300">
            대화 화면은 곧 제공될 예정이에요
          </p>
        )}
        <Link
          href="/chat"
          className="text-md-medium text-blue-300 underline-offset-2 hover:underline"
        >
          채팅 목록으로
        </Link>
      </div>
    </div>
  );
};
