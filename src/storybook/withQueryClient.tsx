import type { Decorator } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { chatQueryKeys } from '@/hooks/useChat';
import type {
  ChatRoomListResponse,
  ChatUnreadCountResponse,
} from '@/types/chat';

const STORY_UNREAD: ChatUnreadCountResponse = {
  data: { unreadCount: 0 },
};

const STORY_ROOMS: ChatRoomListResponse = {
  data: { rooms: [] },
};

/**
 * TanStack Query Provider + 채팅 unread/rooms 캐시 seed.
 * (프로젝트에 MSW가 없어 QueryClient로 API 호출을 대체한다.)
 */
export const withQueryClient: Decorator = (Story) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
      mutations: { retry: false },
    },
  });

  queryClient.setQueryData(chatQueryKeys.unread(), STORY_UNREAD);
  queryClient.setQueryData(chatQueryKeys.rooms(), STORY_ROOMS);

  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};
