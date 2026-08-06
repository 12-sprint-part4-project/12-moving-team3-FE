'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import EditIcon from '@/assets/icons/edit.svg';
import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import type { CommunityTabId } from '@/constants/communityOptions';
import { useAuth } from '@/hooks/useAuth';
import { buildCommunityWriteHref } from '@/lib/communityListContext';
import { cn } from '@/lib/utils';

type CommunityWriteButtonVariant = 'fab' | 'toolbar' | 'desktop';

interface CommunityWriteButtonProps {
  variant: CommunityWriteButtonVariant;
  activeTab?: CommunityTabId;
  className?: string;
}

/** 커뮤니티 글쓰기 — Mobile FAB / Tablet·Desktop 버튼 */
export const CommunityWriteButton = ({
  variant,
  activeTab = 'board',
  className = '',
}: CommunityWriteButtonProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const writeHref = buildCommunityWriteHref(activeTab);

  const handleWriteClick = useCallback(() => {
    if (user) {
      router.push(writeHref);
      return;
    }

    setIsLoginModalOpen(true);
  }, [router, user, writeHref]);

  const handleCloseLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const loginModal = (
    <LoginRequiredModal
      open={isLoginModalOpen}
      onClose={handleCloseLoginModal}
    />
  );

  if (variant === 'fab') {
    return (
      <>
        <button
          type="button"
          aria-label="글쓰기"
          onClick={handleWriteClick}
          className={cn(
            'fixed right-4 bottom-6 z-40 flex size-[4.125rem] cursor-pointer items-center justify-center rounded-3xl bg-blue-300 shadow-[0_4px_12px_rgba(0,0,0,0.18)] min-[46.5rem]:hidden',
            className
          )}
        >
          <EditIcon className="size-9 text-white" aria-hidden />
        </button>
        {loginModal}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleWriteClick}
        className={cn(
          'hidden shrink-0 cursor-pointer items-center justify-center bg-blue-300 text-white transition-colors hover:bg-blue-200',
          variant === 'toolbar' &&
            'h-9 min-w-[6.875rem] rounded-lg px-4 text-sm-semibold min-[46.5rem]:inline-flex xl:hidden',
          variant === 'desktop' &&
            'h-[3.125rem] min-w-[11.25rem] rounded-lg px-4 text-xl-semibold xl:inline-flex',
          className
        )}
      >
        글쓰기
      </button>
      {loginModal}
    </>
  );
};
