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

/** Figma tab-bar — Mobile / Tablet / Desktop (15122:41073) */
export const CommunityTabBar = ({
  activeTab,
  onTabChange,
  className = '',
}: CommunityTabBarProps) => {
  const router = useRouter();

  return (
    <div
      className={cn(
        'shrink-0 border-b border-line-100 bg-white pt-4 shadow-page-title',
        COMMUNITY_HEADER_X,
        COMMUNITY_DESKTOP_X,
        className
      )}
    >
      <nav aria-label="커뮤니티 탭" className="flex items-start gap-6 lg:gap-8">
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
                'flex cursor-pointer items-center justify-center self-stretch py-4 text-xl-semibold whitespace-nowrap',
                isActive
                  ? 'border-b-2 border-black-400 text-black-400'
                  : 'text-gray-400'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
