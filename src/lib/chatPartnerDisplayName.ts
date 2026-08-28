import type { ChatPartner } from '@/types/chat';

/** 채팅 목록·방 로드 전·언마운트 fallback — `| 무빙` 포함 absolute */
export const CHAT_PAGE_DOCUMENT_TITLE = '채팅 | 무빙';

/**
 * 채팅방 탭 타이틀용 표시명.
 * BE displayName 우선 (알림·헤더와 동일 규칙, #225 / BE #299).
 */
export const chatPartnerDisplayName = (
  partner: Pick<ChatPartner, 'displayName' | 'nickname' | 'name'>
): string =>
  partner.displayName?.trim() ||
  partner.nickname?.trim() ||
  partner.name?.trim() ||
  '상대방';

/** 채팅방 document.title — `| 무빙` 포함 absolute 문자열 */
export const chatRoomDocumentTitle = (
  partner: Pick<ChatPartner, 'displayName' | 'nickname' | 'name'>
): string => `${chatPartnerDisplayName(partner)}님과의 채팅 | 무빙`;
