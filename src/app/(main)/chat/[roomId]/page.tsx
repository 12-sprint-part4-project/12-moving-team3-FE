import type { Metadata } from 'next';

import { ChatRoomPage } from '@/components/chat/ChatRoomPage';

/** 로드 전·실패 fallback — 성공 시 ChatRoomPage가 document.title로 덮어씀 */
export const metadata: Metadata = {
  title: '채팅',
};

interface PageProps {
  params: Promise<{ roomId: string }>;
}

const ChatRoomRoutePage = async ({ params }: PageProps) => {
  const { roomId } = await params;
  return <ChatRoomPage roomId={roomId} />;
};

export default ChatRoomRoutePage;
