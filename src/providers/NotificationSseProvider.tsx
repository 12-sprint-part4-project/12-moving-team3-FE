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
 * 견적 상태 알림은 채팅 칩·입력 상태 캐시도 함께 맞춘다 (#208).
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
    });

    return () => {
      disconnect();
    };
  }, [isReady, user, queryClient, showToast]);

  return children;
};
