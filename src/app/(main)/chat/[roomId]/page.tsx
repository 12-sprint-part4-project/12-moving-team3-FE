import { ChatRoomPage } from '@/components/chat/ChatRoomPage';
import { createPageMetadata } from '@/i18n/createPageMetadata';

/** 로드 전·실패 fallback — 성공 시 ChatRoomPage가 document.title로 덮어씀 */
export const generateMetadata = createPageMetadata('chat.title');

interface PageProps {
  params: Promise<{ roomId: string }>;
}

const ChatRoomRoutePage = async ({ params }: PageProps) => {
  const { roomId } = await params;
  return <ChatRoomPage roomId={roomId} />;
};

export default ChatRoomRoutePage;
