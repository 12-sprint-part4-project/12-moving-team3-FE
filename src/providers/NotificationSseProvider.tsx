'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, type ReactNode } from 'react';

import AlarmIcon from '@/assets/icons/alarm.svg';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import {
  applyNotificationToCache,
  invalidateChatQueriesForNotification,
  invalidateNotificationList,
} from '@/lib/notificationSseCache';
import {
  connectNotificationStream,
  disconnectNotificationStream,
} from '@/lib/notificationSseClient';

interface NotificationSseProviderProps {
  children: ReactNode;
}

/**
 * 로그인 세션이 있을 때 알림 SSE를 연결하고,
 * 단건 알림은 캐시·토스트에, fan-out refresh는 목록 invalidate로 반영한다.
 * 견적·지정 상태 알림은 채팅 칩·입력 상태 캐시도 함께 맞춘다 (#208, #216).
 */
export const NotificationSseProvider = ({
  children,
}: NotificationSseProviderProps) => {
  const { user, isReady } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!user) {
      disconnectNotificationStream();
      return;
    }

    const disconnect = connectNotificationStream({
      onNotification: (item) => {
        applyNotificationToCache(queryClient, item);
        invalidateChatQueriesForNotification(queryClient, item.type);
        showToast({
          content: item.content,
          icon: AlarmIcon,
        });
      },
      onUnreadCount: () => {
        invalidateNotificationList(queryClient);
      },
      // Outbox 대량 발송 — 본문 없음, 목록·배지만 재조회
      onNotificationRefresh: () => {
        invalidateNotificationList(queryClient);
      },
      // 재연결 성공 — 끊겨 있던 동안 놓쳤을 수 있는 이벤트 캐치업
      onReconnected: () => {
        invalidateNotificationList(queryClient);
      },
      // 재연결은 클라이언트가 지수 백오프로 자동 처리되므로... 사용자에게는 노출하지 않고 로그만 남긴다
      onError: (error) => {
        console.error('[notification-sse] stream error', error);
      },
    });

    return () => {
      disconnect();
    };
  }, [isReady, user, queryClient, showToast]);

  return children;
};
