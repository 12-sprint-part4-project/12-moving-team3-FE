import type { ChatLastMessage } from '@/types/chat';

/** 목록/드롭다운용 마지막 메시지 미리보기 문구 */
export const getChatLastMessagePreview = (
  lastMessage: ChatLastMessage | null
): string => {
  if (!lastMessage) {
    return '대화를 시작해 보세요';
  }

  if (lastMessage.messageType === 'IMAGE') {
    return '사진';
  }

  const content = lastMessage.content.trim();
  return content.length > 0 ? content : '대화를 시작해 보세요';
};
