'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import type { CommunityTabId } from '@/constants/communityOptions';
import { useAuth } from '@/hooks/useAuth';
import { buildCommunityWriteHref } from '@/lib/communityListContext';

/** 커뮤니티 글쓰기 — 로그인 확인 후 이동 */
export const useCommunityWriteAction = (
  activeTab: CommunityTabId = 'board'
) => {
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

  return {
    handleWriteClick,
    isLoginModalOpen,
    handleCloseLoginModal,
  };
};
