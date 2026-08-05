'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import MenuIcon from '@/assets/icons/menu.svg';

import { Button } from '@/components/Button/Button';
import { ChatAvatar } from '@/components/chat/ChatAvatar';
import { Modal } from '@/components/ui/Modal/Modal';
import { ModalBasic } from '@/components/ui/Modal/ModalBasic';
import { useLeaveChatRoom } from '@/hooks/useChat';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { cn } from '@/lib/utils';
import type { ChatPartner } from '@/types/chat';

export interface ChatRoomHeaderProps {
  partner: ChatPartner;
  roomId: number;
  className?: string;
}

/** 채팅방 상단 — 뒤로가기 / 상대 정보 / 나가기 메뉴 */
export const ChatRoomHeader = ({
  partner,
  roomId,
  className,
}: ChatRoomHeaderProps) => {
  const router = useRouter();
  const { showToast } = useToast();
  const leaveMutation = useLeaveChatRoom();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(menuRef, isMenuOpen, setIsMenuOpen);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const handleLeaveConfirm = async () => {
    try {
      await leaveMutation.mutateAsync(roomId);
      setIsLeaveModalOpen(false);
      showToast({ content: '채팅방에서 나갔습니다.' });
      router.replace('/chat');
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '채팅방 나가기에 실패했습니다.';
      showToast({ content: message });
    }
  };

  return (
    <>
      <header
        className={cn(
          'flex w-full items-center gap-3 border-b border-line-100 bg-white px-4 py-3 md:px-6',
          className
        )}
      >
        <Link
          href="/chat"
          aria-label="채팅 목록으로"
          className="inline-flex size-6 shrink-0 items-center justify-center text-black-400"
        >
          <ChevronLeftIcon className="size-6" aria-hidden />
        </Link>

        <ChatAvatar
          src={partner.profileImageUrl}
          alt=""
          className="size-9"
        />

        <p className="min-w-0 flex-1 truncate text-2lg-semibold text-black-400">
          {partner.nickname}
        </p>

        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            aria-label="채팅방 메뉴"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex size-6 cursor-pointer items-center justify-center text-gray-300"
          >
            <MenuIcon className="size-6" aria-hidden />
          </button>

          {isMenuOpen ? (
            <div
              role="menu"
              className="absolute top-full right-0 z-50 mt-2 min-w-[8.75rem] rounded-2xl border border-line-200 bg-white py-1.5 shadow-[0.125rem_0.125rem_0.25rem] shadow-shadow-gray-200/20"
            >
              <button
                type="button"
                role="menuitem"
                className="flex w-full cursor-pointer px-4 py-3 text-left text-md-medium text-red-200"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsLeaveModalOpen(true);
                }}
              >
                채팅방 나가기
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {isLeaveModalOpen ? (
        <Modal onClose={() => setIsLeaveModalOpen(false)}>
          <ModalBasic
            title="채팅방 나가기"
            onClose={() => setIsLeaveModalOpen(false)}
            footer={
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
                <Button
                  type="button"
                  variant="outlined"
                  size="sm"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="sm:flex-1"
                >
                  취소
                </Button>
                <Button
                  type="button"
                  variant="solid"
                  size="sm"
                  disabled={leaveMutation.isPending}
                  onClick={() => void handleLeaveConfirm()}
                  className="sm:flex-1"
                >
                  나가기
                </Button>
              </div>
            }
          >
            <p className="px-6 pb-6 text-2lg-medium text-black-300">
              채팅방에서 나가면 대화 목록에서 삭제됩니다. 나가시겠어요?
            </p>
          </ModalBasic>
        </Modal>
      ) : null}
    </>
  );
};
