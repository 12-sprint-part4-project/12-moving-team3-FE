'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';

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
  DEFAULT_POST_LIST_CONTEXT,
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
  const [activeTabOverride, setActiveTabOverrideState] =
    useState<TabOverrideState | null>(null);

  // useSearchParams 미사용 — window.location.search에서 직접 읽어 Suspense 불필요
  const [localTab, setLocalTab] = useState<CommunityTabId>(
    DEFAULT_POST_LIST_CONTEXT.tab
  );

  // 페인트 전 탭 동기화 — 깜빡임 방지
  useLayoutEffect(() => {
    setLocalTab(
      parsePostListContextFromSearchParams(
        new URLSearchParams(window.location.search)
      ).tab
    );
  }, []);

  // 브라우저 back/forward 시 탭 동기화
  useEffect(() => {
    const handlePopState = () => {
      setLocalTab(
        parsePostListContextFromSearchParams(
          new URLSearchParams(window.location.search)
        ).tab
      );
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const activeTab =
    activeTabOverride?.pathname === pathname
      ? activeTabOverride.tab
      : localTab;

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
      setLocalTab(tabId);

      const currentContext = parsePostListContextFromSearchParams(
        new URLSearchParams(window.location.search)
      );
      const href = buildCommunityListHref({ ...currentContext, tab: tabId });

      if (pathname === '/community') {
        router.replace(href, { scroll: false });
        return;
      }

      router.push(href);
    },
    [pathname, router]
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
