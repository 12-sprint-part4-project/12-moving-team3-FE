'use client';

import {
  COMMUNITY_TABS,
  type CommunityTabId,
} from '@/constants/communityOptions';
import { cn } from '@/lib/utils';

import { COMMUNITY_DESKTOP_X, COMMUNITY_HEADER_X } from './communityLayout';

interface CommunityTabBarProps {
  activeTab: CommunityTabId;
  onTabChange: (tabId: CommunityTabId) => void;
  className?: string;
}

const TAB_WIDTH_MOBILE: Record<CommunityTabId, string> = {
  board: 'w-[3.75rem]',
  furniture: 'w-[4.5rem]',
};

const TAB_WIDTH_DESKTOP: Record<CommunityTabId, string> = {
  board: 'w-16',
  furniture: 'w-[4.75rem]',
};

/** Figma tab-bar — Mobile / Tablet / Desktop (15122:41073) */
export const CommunityTabBar = ({
  activeTab,
  onTabChange,
  className = '',
}: CommunityTabBarProps) => (
  <div
    className={cn(
      'relative flex h-11 gap-2 border-b border-line-200 bg-white',
      'min-[46.5rem]:gap-2 xl:h-12 xl:gap-2',
      COMMUNITY_HEADER_X,
      COMMUNITY_DESKTOP_X,
      className
    )}
    role="tablist"
    aria-label="커뮤니티 탭"
  >
    {COMMUNITY_TABS.map((tab) => {
      const isActive = activeTab === tab.id;

      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'relative flex h-11 shrink-0 items-start justify-center pt-2.5 xl:h-12',
            TAB_WIDTH_MOBILE[tab.id],
            TAB_WIDTH_DESKTOP[tab.id]
          )}
        >
          <span
            className={cn(
              isActive
                ? 'text-md-bold text-blue-300 min-[46.5rem]:text-lg-semibold xl:text-lg-bold'
                : 'text-md-regular text-gray-400 min-[46.5rem]:text-lg-regular xl:text-lg-regular'
            )}
          >
            {tab.label}
          </span>
          {isActive ? (
            <span
              aria-hidden
              className="absolute bottom-0 left-0 h-[3px] w-full rounded-sm bg-blue-300"
            />
          ) : null}
        </button>
      );
    })}
  </div>
);
