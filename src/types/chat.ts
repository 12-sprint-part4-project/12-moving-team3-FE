import type { ApiSuccessResponse } from '@/types/api';
import type { ApiUserType } from '@/types/auth';
import type { ApiMoveType } from '@/types/estimateRequest';

/** 1:1 채팅방 유형 */
export type ChatRoomType = 'GENERAL' | 'DESIGNATED' | 'COMMUNITY';

/** 메시지 유형 */
export type ChatMessageType = 'TEXT' | 'IMAGE';

/** 채팅 상대방 요약 */
export interface ChatPartner {
  id: string;
  userType: ApiUserType;
  nickname: string;
  /** 공개/CDN URL. 이미지 없으면 null */
  profileImageUrl: string | null;
}

/** 목록용 마지막 메시지 요약 */
export interface ChatLastMessage {
  content: string;
  messageType: ChatMessageType;
  createdAt: string;
}

/** GET /api/chat/rooms — 방 목록 아이템 */
export interface ChatRoomListItem {
  roomId: number;
  roomType: ChatRoomType;
  partner: ChatPartner;
  lastMessage: ChatLastMessage | null;
  unreadCount: number;
}

export interface ChatRoomListData {
  rooms: ChatRoomListItem[];
}

export type ChatRoomListResponse = ApiSuccessResponse<ChatRoomListData>;

/** 방 상세의 견적 요청 요약 */
export interface ChatRequestSummary {
  estimateRequestId: number;
  moveType: ApiMoveType | null;
  moveDate: string | null;
  originAddress: string | null;
  destinationAddress: string | null;
}

/** GET /api/chat/rooms/:roomId — 방 상세 */
export interface ChatRoomDetailData {
  partner: ChatPartner;
  requestSummary: ChatRequestSummary | null;
  quoteId: number | null;
  isMessagingAllowed: boolean;
  updatedAt: string;
}

export type ChatRoomDetailResponse = ApiSuccessResponse<ChatRoomDetailData>;

/** POST /api/chat/rooms — 견적 채팅방 생성 요청 */
export interface CreateEstimateChatRoomRequest {
  moverId: string;
  roomType: 'GENERAL' | 'DESIGNATED';
  estimateRequestId?: number;
  designatedMoverId?: number;
  quoteId?: number;
}

/** POST /api/chat/rooms — 가구나눔(커뮤니티) 채팅방 생성 요청 */
export interface CreateCommunityChatRoomRequest {
  /** 상대방 users.id (게시글 작성자) */
  moverId: string;
  roomType: 'COMMUNITY';
  communityPostId: number;
}

/** POST /api/chat/rooms — 생성 요청 */
export type CreateChatRoomRequest =
  | CreateEstimateChatRoomRequest
  | CreateCommunityChatRoomRequest;

/** POST /api/chat/rooms — 생성/기존 방 반환 */
export interface CreateChatRoomData {
  roomId: number;
  roomType: ChatRoomType;
  quoteId: number | null;
  createdAt?: string;
  updatedAt: string;
}

export type CreateChatRoomResponse = ApiSuccessResponse<CreateChatRoomData>;

/** GET /api/chat/unread-count */
export interface ChatUnreadCountData {
  unreadCount: number;
}

export type ChatUnreadCountResponse = ApiSuccessResponse<ChatUnreadCountData>;

/**
 * 채팅 메시지 DTO.
 * - 응답 `attachments`: 조회용 Presigned GET URL[] (유효 1시간). TEXT는 [].
 * - IMAGE 전송 요청의 `attachments`는 s3Key[] 이며 별도 SendChatImageMessageRequest 참고.
 */
export interface ChatMessage {
  messageId: number;
  senderId: string;
  senderUserType: ApiUserType;
  messageType: ChatMessageType;
  content: string;
  isFiltered: boolean;
  attachments: string[];
  createdAt: string;
}

/** GET /api/chat/rooms/:roomId/messages 쿼리 */
export interface GetChatMessagesParams {
  before?: number;
  /** 기본 30, 최대 100 */
  limit?: number;
}

export interface ChatMessagesData {
  messages: ChatMessage[];
}

export interface ChatMessagesMeta {
  hasNext: boolean;
  nextCursor: number | null;
}

export type ChatMessagesResponse = ApiSuccessResponse<
  ChatMessagesData,
  ChatMessagesMeta
>;

/** TEXT 메시지 전송 요청 */
export interface SendChatTextMessageRequest {
  messageType: 'TEXT';
  content: string;
}

/**
 * IMAGE 메시지 전송 요청.
 * `attachments`는 S3 key(s3Key) 배열만 허용한다. view URL을 넣지 않는다.
 * (사전 GET /api/presigned-upload-url?prefix=chat-attachments → S3 PUT 후 전달)
 */
export interface SendChatImageMessageRequest {
  messageType: 'IMAGE';
  attachments: string[];
}

export type SendChatMessageRequest =
  | SendChatTextMessageRequest
  | SendChatImageMessageRequest;

/** POST /api/chat/rooms/:roomId/messages — 응답 data (attachments = view URL[]) */
export type SendChatMessageData = ChatMessage;

export type SendChatMessageResponse = ApiSuccessResponse<SendChatMessageData>;

/** POST /api/chat/rooms/:roomId/read */
export interface MarkChatRoomAsReadRequest {
  lastReadMessageId: number;
}

export interface MarkChatRoomAsReadData {
  lastReadMessageId: number;
}

export type MarkChatRoomAsReadResponse =
  ApiSuccessResponse<MarkChatRoomAsReadData>;

/** POST /api/chat/rooms/:roomId/leave */
export interface LeaveChatRoomData {
  roomId: number;
  leftAt: string;
}

export type LeaveChatRoomResponse = ApiSuccessResponse<LeaveChatRoomData>;

/**
 * GET /api/presigned-upload-url (prefix=chat-attachments) 응답 data.
 * uploadUrl로 S3 PUT 후, 반환된 s3Key를 IMAGE 메시지 attachments에 넣는다.
 */
export interface ChatPresignedUploadData {
  uploadUrl: string;
  s3Key: string;
}

export type ChatPresignedUploadResponse =
  ApiSuccessResponse<ChatPresignedUploadData>;

/** 채팅 첨부 업로드 요청 쿼리 (prefix는 chat-attachments 고정) */
export interface ChatPresignedUploadParams {
  filename: string;
  contentType: string;
}

/** Socket: Client → Server payload */
export interface ChatJoinPayload {
  roomId: number;
}

export interface ChatLeavePayload {
  roomId: number;
}

/** Socket: Server → Client payloads */
export interface ChatSocketMessagePayload {
  roomId: number;
  message: ChatMessage;
}

export interface ChatSocketReadPayload {
  roomId: number;
  readerId: string;
  lastReadMessageId: number;
}

export interface ChatSocketUnreadPayload {
  unreadCount: number;
  roomId?: number;
  roomUnreadCount?: number;
}

export interface ChatSocketErrorPayload {
  code: string;
  message: string;
}
