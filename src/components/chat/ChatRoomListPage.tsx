'use client';

import { ChatRoomListItem } from '@/components/chat/ChatRoomListItem';
import { useAuth } from '@/hooks/useAuth';
import { useChatRooms } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

export interface ChatRoomListPageProps {
  className?: string;
}

/** 채팅방 전체 목록 */
export const ChatRoomListPage = ({ className }: ChatRoomListPageProps) => {
  const { user, isReady } = useAuth();
  const enabled = Boolean(isReady && user);
  const { rooms, isPending, isError, isEmpty } = useChatRooms({ enabled });

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

  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-[43rem] flex-col px-6 py-10',
        className
      )}
    >
      <h1 className="text-2xl-bold text-black-400">채팅</h1>

      <div className="mt-6 flex flex-col overflow-hidden rounded-3xl border border-line-200 bg-white">
        {isPending ? (
          <p className="px-6 py-10 text-center text-md-medium text-gray-300">
            불러오는 중…
          </p>
        ) : null}

        {isError ? (
          <p className="px-6 py-10 text-center text-md-medium text-gray-300">
            채팅 목록을 불러오지 못했어요
          </p>
        ) : null}

        {!isPending && !isError && isEmpty ? (
          <p className="px-6 py-10 text-center text-md-medium text-gray-300">
            아직 대화가 없어요
          </p>
        ) : null}

        {!isPending && !isError
          ? rooms.map((room) => (
              <ChatRoomListItem key={room.roomId} room={room} />
            ))
          : null}
      </div>
    </div>
  );
};
