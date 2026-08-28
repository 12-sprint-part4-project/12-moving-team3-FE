import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { NOTIFICATION_LIST_FIXTURE } from '@/components/Gnb/notificationFixtures';
import { chatQueryKeys, notificationQueryKeys } from '@/constants/queryKey';

import type {
  ChatRoomListResponse,
  ChatUnreadCountResponse,
} from '@/types/chat';
import type { NotificationListResponse } from '@/types/notification';
import type { Decorator } from '@storybook/nextjs-vite';

const STORY_UNREAD: ChatUnreadCountResponse = {
  data: { unreadCount: 0 },
};

const STORY_ROOMS: ChatRoomListResponse = {
  data: { rooms: [] },
};

const STORY_NOTIFICATIONS: NotificationListResponse = {
  data: { items: NOTIFICATION_LIST_FIXTURE },
  meta: { totalCount: NOTIFICATION_LIST_FIXTURE.length },
};

/**
 * TanStack Query Provider + 채팅 unread/rooms · 알림 목록 캐시 seed.
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
  // GnbDefault 알림 벨 — 단일 목록 키 seed
  queryClient.setQueryData(notificationQueryKeys.list(), STORY_NOTIFICATIONS);

  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};
