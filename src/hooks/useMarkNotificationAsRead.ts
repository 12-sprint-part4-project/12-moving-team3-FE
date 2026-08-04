import { useMutation, useQueryClient } from '@tanstack/react-query';

import { notificationQueryKeys } from '@/hooks/useNotifications';
import { markNotificationAsRead } from '@/services/notificationApi';

/**
 * 알림 단건 읽음 처리.
 * 성공 시 알림 관련 쿼리를 invalidate 한다.
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (notificationId: number) =>
      markNotificationAsRead(notificationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.all,
      });
    },
  });

  return mutation;
};
