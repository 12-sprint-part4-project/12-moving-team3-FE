import { createPageMetadata } from '@/i18n/createPageMetadata';

import ChatRoomPageClient from './page.client';

/** 로드 전·실패 fallback — 성공 시 ChatRoomPageClient가 document.title로 덮어씀 */
export const generateMetadata = createPageMetadata('chat.title');

export interface ChatRoomPageProps {
  params: Promise<{ roomId: string }>;
}

/** `/chat/[roomId]` 서버 페이지 — 채팅방 상세 */
const ChatRoomPage = async ({ params }: ChatRoomPageProps) => {
  const { roomId } = await params;

  return <ChatRoomPageClient roomId={roomId} />;
};

export default ChatRoomPage;
