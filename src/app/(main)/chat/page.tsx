import { createPageMetadata } from '@/i18n/createPageMetadata';

import ChatListPageClient from './page.client';

export const generateMetadata = createPageMetadata('chat.title');

/** `/chat` 서버 페이지 — 채팅방 목록 */
const ChatPage = () => {
  return <ChatListPageClient />;
};

export default ChatPage;
