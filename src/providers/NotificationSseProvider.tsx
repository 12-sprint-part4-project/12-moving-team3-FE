'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, type ReactNode } from 'react';

import AlarmIcon from '@/assets/icons/alarm.svg';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import {
  applyNotificationToCache,
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
 * 새 알림을 목록 캐시·토스트에 반영한다.
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
        showToast({
          content: item.content,
          icon: AlarmIcon,
        });
      },
      onUnreadCount: () => {
        invalidateNotificationList(queryClient);
      },
    });

    return () => {
      disconnect();
    };
  }, [isReady, user, queryClient, showToast]);

  return children;
};
