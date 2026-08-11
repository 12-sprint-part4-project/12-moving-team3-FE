'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { CommunityTabId } from '@/constants/communityOptions';
import {
  WRITE_FAB_BOTTOM_CLASS,
  WRITE_FAB_BOTTOM_RAISED_CLASS,
  WRITE_FAB_REST_BOTTOM_CLASS,
  WRITE_FAB_REST_BOTTOM_RAISED_CLASS,
} from '@/constants/floatingActionLayout';
import { useIsScrolled } from '@/hooks/useIsScrolled';
import {
  buildCommunityListHref,
  parsePostListContextFromSearchParams,
} from '@/lib/communityListContext';

import { CommunityTabBar } from './CommunityTabBar';
import { CommunityWriteButton } from './CommunityWriteButton';

interface TabOverrideState {
  tab: CommunityTabId;
  pathname: string;
}

interface CommunityTabBarContextValue {
  setActiveTabOverride: (tab: CommunityTabId | null) => void;
}

const CommunityTabBarContext = createContext<CommunityTabBarContextValue | null>(
  null
);

/** 상세에서 게시글 카테고리 기준 탭 활성화 override */
export const useCommunityTabBarOverride = (): CommunityTabBarContextValue => {
  const context = useContext(CommunityTabBarContext);

  if (context === null) {
    throw new Error(
      'useCommunityTabBarOverride must be used within CommunityLayoutClient'
    );
  }

  return context;
};

interface CommunityLayoutClientProps {
  children: React.ReactNode;
}

/** (browse) layout 탭바 — 목록·상세 공통 */
export const CommunityLayoutClient = ({
  children,
}: CommunityLayoutClientProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTabOverride, setActiveTabOverrideState] =
    useState<TabOverrideState | null>(null);

  const listContext = useMemo(
    () => parsePostListContextFromSearchParams(searchParams),
    [searchParams]
  );

  const activeTab =
    activeTabOverride?.pathname === pathname
      ? activeTabOverride.tab
      : listContext.tab;

  const setActiveTabOverride = useCallback(
    (tab: CommunityTabId | null) => {
      setActiveTabOverrideState(
        tab === null ? null : { tab, pathname }
      );
    },
    [pathname]
  );

  const handleTabChange = useCallback(
    (tabId: CommunityTabId) => {
      const href = buildCommunityListHref({ ...listContext, tab: tabId });

      if (pathname === '/community') {
        router.replace(href, { scroll: false });
        return;
      }

      router.push(href);
    },
    [listContext, pathname, router]
  );

  const tabBarContextValue = useMemo(
    () => ({ setActiveTabOverride }),
    [setActiveTabOverride]
  );

  const isScrolled = useIsScrolled();
  const isWritePage = pathname.startsWith('/community/write');
  const isDetailPage =
    !isWritePage &&
    pathname !== '/community' &&
    pathname.startsWith('/community/');

  const fabBottomClass = isDetailPage
    ? (isScrolled ? WRITE_FAB_BOTTOM_RAISED_CLASS : WRITE_FAB_REST_BOTTOM_RAISED_CLASS)
    : (isScrolled ? WRITE_FAB_BOTTOM_CLASS : WRITE_FAB_REST_BOTTOM_CLASS);

  return (
    <CommunityTabBarContext.Provider value={tabBarContextValue}>
      <CommunityTabBar activeTab={activeTab} onTabChange={handleTabChange} />
      {children}
      {!isWritePage && (
        <CommunityWriteButton
          variant="fab"
          activeTab={activeTab}
          visibility={isDetailPage ? 'always' : 'mobile-always'}
          bottomClass={fabBottomClass}
        />
      )}
    </CommunityTabBarContext.Provider>
  );
};
