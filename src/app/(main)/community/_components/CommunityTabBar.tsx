'use client';

import { useRouter } from 'next/navigation';

import {
  COMMUNITY_TABS,
  type CommunityTabId,
} from '@/constants/communityOptions';
import { cn } from '@/lib/utils';

import {
  COMMUNITY_DESKTOP_X,
  COMMUNITY_HEADER_X,
  COMMUNITY_TAB_LABEL_ACTIVE_CLASS,
  COMMUNITY_TAB_LABEL_INACTIVE_CLASS,
} from './communityLayout';

const TAB_HREF: Record<CommunityTabId, string> = {
  board: '/community',
  furniture: '/community?tab=furniture',
};

interface CommunityTabBarProps {
  activeTab: CommunityTabId;
  onTabChange: (tabId: CommunityTabId) => void;
  className?: string;
}

const TAB_WIDTH_TABLET: Record<CommunityTabId, string> = {
  board: 'min-[46.5rem]:w-[5.5rem]',
  furniture: 'min-[46.5rem]:w-[6.75rem]',
};

/** Figma tab-bar — Mobile / Tablet / Desktop (15122:41073) */
export const CommunityTabBar = ({
  activeTab,
  onTabChange,
  className = '',
}: CommunityTabBarProps) => {
  const router = useRouter();

  return (
    <nav
      className={cn(
        'relative flex h-12 border-b border-line-200 bg-white',
        'min-[46.5rem]:gap-2 xl:h-14 xl:gap-2',
        COMMUNITY_HEADER_X,
        COMMUNITY_DESKTOP_X,
        className
      )}
      aria-label="커뮤니티 탭"
    >
      {COMMUNITY_TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onMouseEnter={() => router.prefetch(TAB_HREF[tab.id])}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'relative flex h-12 min-w-0 flex-1 basis-0 cursor-pointer items-start justify-center pt-3',
              'min-[46.5rem]:flex-none min-[46.5rem]:shrink-0',
              TAB_WIDTH_TABLET[tab.id],
              'xl:h-14 xl:pt-3.5'
            )}
          >
            <span
              className={cn(
                isActive
                  ? COMMUNITY_TAB_LABEL_ACTIVE_CLASS
                  : COMMUNITY_TAB_LABEL_INACTIVE_CLASS
              )}
            >
              {tab.label}
            </span>
            {isActive ? (
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-[0.1875rem] w-full rounded-sm bg-blue-300"
              />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
};
