import { ChatRouteTransition } from '@/components/chat/ChatRouteTransition';

interface ChatLayoutProps {
  children: React.ReactNode;
}

/** 채팅 목록·상세 공통 — 라우트 전환 모션 셸 */
const ChatLayout = ({ children }: ChatLayoutProps) => (
  <ChatRouteTransition>{children}</ChatRouteTransition>
);

export default ChatLayout;
