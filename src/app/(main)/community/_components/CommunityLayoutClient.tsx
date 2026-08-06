'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { type CommunityTabId } from '@/constants/communityOptions';
import {
  buildCommunityListHref,
  parsePostListContextFromSearchParams,
} from '@/lib/communityListContext';

import { CommunityTabBar } from './CommunityTabBar';

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
  const [activeTabOverride, setActiveTabOverride] =
    useState<CommunityTabId | null>(null);

  const listContext = useMemo(
    () => parsePostListContextFromSearchParams(searchParams),
    [searchParams]
  );

  const activeTab = activeTabOverride ?? listContext.tab;

  useEffect(() => {
    setActiveTabOverride(null);
  }, [pathname]);

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

  return (
    <CommunityTabBarContext.Provider value={tabBarContextValue}>
      <CommunityTabBar activeTab={activeTab} onTabChange={handleTabChange} />
      {children}
    </CommunityTabBarContext.Provider>
  );
};
