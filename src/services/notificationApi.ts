import {
  API_BASE_URL,
  ApiError,
  DEFAULT_API_ERROR_MESSAGE,
  throwApiError,
} from '@/lib/apiClient';
import { authFetch } from '@/lib/authFetch';
import {
  notificationListResponseSchema,
  notificationMarkReadResponseSchema,
} from '@/lib/notificationSchema';
import type {
  NotificationItem,
  NotificationListResponse,
} from '@/types/notification';

/**
 * 알림 목록 조회 (최신 최대 10개).
 * GET /api/notifications — 수신자 = 로그인 유저 (역할 path 없음)
 */
export const getNotifications =
  async (): Promise<NotificationListResponse> => {
    const response = await authFetch(`${API_BASE_URL}/api/notifications`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      return throwApiError(response);
    }

    const body: unknown = await response.json().catch(() => null);
    const parsed = notificationListResponseSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(500, DEFAULT_API_ERROR_MESSAGE, 'INVALID_RESPONSE');
    }

    return parsed.data;
  };

/**
 * 알림 단건 읽음 처리.
 * PATCH /api/notifications/:notificationId
 */
export const markNotificationAsRead = async (
  notificationId: number
): Promise<NotificationItem> => {
  const response = await authFetch(
    `${API_BASE_URL}/api/notifications/${notificationId}`,
    {
      method: 'PATCH',
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    return throwApiError(response);
  }

  const body: unknown = await response.json().catch(() => null);
  const parsed = notificationMarkReadResponseSchema.safeParse(body);

  if (!parsed.success) {
    throw new ApiError(500, DEFAULT_API_ERROR_MESSAGE, 'INVALID_RESPONSE');
  }

  return parsed.data.data;
};
