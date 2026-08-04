import { ChatRoomPage } from '@/components/chat/ChatRoomPage';

interface PageProps {
  params: Promise<{ roomId: string }>;
}

const ChatRoomRoutePage = async ({ params }: PageProps) => {
  const { roomId } = await params;
  return <ChatRoomPage roomId={roomId} />;
};

export default ChatRoomRoutePage;
