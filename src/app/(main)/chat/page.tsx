import { ChatRoomListPage } from '@/components/chat/ChatRoomListPage';
import { createPageMetadata } from '@/i18n/createPageMetadata';

export const generateMetadata = createPageMetadata('chat.title');

const ChatPage = () => {
  return <ChatRoomListPage />;
};

export default ChatPage;
