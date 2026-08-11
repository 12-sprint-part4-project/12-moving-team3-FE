import type { Metadata } from 'next';

import { ChatRoomListPage } from '@/components/chat/ChatRoomListPage';

/** 루트 template → `채팅 | 무빙` */
export const metadata: Metadata = {
  title: '채팅',
};

const ChatPage = () => {
  return <ChatRoomListPage />;
};

export default ChatPage;
