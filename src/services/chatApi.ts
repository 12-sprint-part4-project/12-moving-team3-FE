import {
  API_BASE_URL,
  ApiError,
  DEFAULT_API_ERROR_MESSAGE,
  throwApiError,
} from '@/lib/apiClient';
import { authFetch } from '@/lib/authFetch';
import type {
  ChatMessagesResponse,
  ChatPresignedUploadParams,
  ChatPresignedUploadResponse,
  ChatRoomDetailResponse,
  ChatRoomListResponse,
  ChatUnreadCountResponse,
  CreateChatRoomRequest,
  CreateChatRoomResponse,
  GetChatMessagesParams,
  LeaveChatRoomResponse,
  MarkChatRoomAsReadRequest,
  MarkChatRoomAsReadResponse,
  SendChatMessageRequest,
  SendChatMessageResponse,
} from '@/types/chat';

/** 채팅 첨부 S3 prefix (공통 presign API) */
const CHAT_ATTACHMENT_PREFIX = 'chat-attachments';

const JSON_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
};

/** 인증이 필요한 JSON API 요청 공통 처리 */
const chatFetch = async <T>(
  path: string,
  init: RequestInit = {}
): Promise<T> => {
  const headers = new Headers(JSON_HEADERS);
  new Headers(init.headers).forEach((value, key) => {
    headers.set(key, value);
  });

  const response = await authFetch(`${API_BASE_URL}${path}`, {
    cache: 'no-store',
    ...init,
    headers,
  });

  if (!response.ok) {
    return throwApiError(response);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError(500, DEFAULT_API_ERROR_MESSAGE, 'INVALID_RESPONSE');
  }
};

/** GET /api/chat/rooms — 채팅방 목록 */
export const getChatRooms = (): Promise<ChatRoomListResponse> => {
  return chatFetch<ChatRoomListResponse>('/api/chat/rooms', {
    method: 'GET',
  });
};

/** GET /api/chat/rooms/:roomId — 채팅방 상세 */
export const getChatRoom = (
  roomId: number
): Promise<ChatRoomDetailResponse> => {
  return chatFetch<ChatRoomDetailResponse>(`/api/chat/rooms/${roomId}`, {
    method: 'GET',
  });
};

/**
 * POST /api/chat/rooms — 채팅방 생성 또는 기존 방 반환.
 * BE: 201 신규 / 200 기존·quoteId 업데이트. 응답 body 형태는 동일.
 */
export const createChatRoom = (
  body: CreateChatRoomRequest
): Promise<CreateChatRoomResponse> => {
  return chatFetch<CreateChatRoomResponse>('/api/chat/rooms', {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

/** GET /api/chat/unread-count — 전체 미읽음 수 */
export const getChatUnreadCount = (): Promise<ChatUnreadCountResponse> => {
  return chatFetch<ChatUnreadCountResponse>('/api/chat/unread-count', {
    method: 'GET',
  });
};

/** GET /api/chat/rooms/:roomId/messages — 메시지 이력 (before/limit) */
export const getChatMessages = (
  roomId: number,
  params: GetChatMessagesParams = {}
): Promise<ChatMessagesResponse> => {
  const searchParams = new URLSearchParams();

  if (params.before !== undefined) {
    searchParams.set('before', String(params.before));
  }
  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }

  const query = searchParams.toString();
  const path = `/api/chat/rooms/${roomId}/messages${query ? `?${query}` : ''}`;

  return chatFetch<ChatMessagesResponse>(path, { method: 'GET' });
};

/**
 * POST /api/chat/rooms/:roomId/messages — TEXT/IMAGE 전송.
 *
 * 이미지 계약:
 * - 요청 `attachments` = s3Key[] (view URL 금지)
 * - 응답 `attachments` = 조회용 Presigned GET URL[] (유효 1시간)
 */
export const sendChatMessage = (
  roomId: number,
  body: SendChatMessageRequest
): Promise<SendChatMessageResponse> => {
  return chatFetch<SendChatMessageResponse>(
    `/api/chat/rooms/${roomId}/messages`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    }
  );
};

/** POST /api/chat/rooms/:roomId/read — 읽음 처리 */
export const markChatRoomAsRead = (
  roomId: number,
  body: MarkChatRoomAsReadRequest
): Promise<MarkChatRoomAsReadResponse> => {
  return chatFetch<MarkChatRoomAsReadResponse>(
    `/api/chat/rooms/${roomId}/read`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    }
  );
};

/** POST /api/chat/rooms/:roomId/leave — 나가기 (409 ALREADY_LEFT) */
export const leaveChatRoom = (
  roomId: number
): Promise<LeaveChatRoomResponse> => {
  return chatFetch<LeaveChatRoomResponse>(`/api/chat/rooms/${roomId}/leave`, {
    method: 'POST',
  });
};

/**
 * GET /api/presigned-upload-url?prefix=chat-attachments
 * 채팅 이미지 업로드용 Presigned PUT URL 발급.
 * 반환 s3Key를 IMAGE 메시지 attachments에 전달한다.
 */
export const getChatPresignedUploadUrl = (
  params: ChatPresignedUploadParams
): Promise<ChatPresignedUploadResponse> => {
  const searchParams = new URLSearchParams({
    filename: params.filename,
    contentType: params.contentType,
    prefix: CHAT_ATTACHMENT_PREFIX,
  });

  return chatFetch<ChatPresignedUploadResponse>(
    `/api/presigned-upload-url?${searchParams.toString()}`,
    { method: 'GET' }
  );
};
