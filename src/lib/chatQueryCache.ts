import { chatQueryKeys } from '@/constants/queryKey';

import type { QueryClient } from '@tanstack/react-query';

/**
 * 채팅 방 목록 + 방 상세 전체 prefix를 함께 무효화한다.
 * 견적·지정·SSE 등에서 칩·isMessagingAllowed를 맞출 때 사용한다 (#208).
 */
export const invalidateChatRoomListAndDetails = (
  queryClient: QueryClient
): Promise<void> =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() }),
    queryClient.invalidateQueries({ queryKey: chatQueryKeys.roomDetails() }),
  ]).then(() => undefined);
