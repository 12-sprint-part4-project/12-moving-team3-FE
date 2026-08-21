'use client';

import { motion } from 'framer-motion';
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

import type { ReactNode } from 'react';

const TAB_HREF: Record<CommunityTabId, string> = {
  board: '/community',
  furniture: '/community?tab=furniture',
};

interface CommunityTabBarProps {
  activeTab: CommunityTabId;
  onTabChange: (tabId: CommunityTabId) => void;
  rightSlot?: ReactNode;
  className?: string;
}

/** Figma tab-bar — Mobile / Tablet / Desktop (15122:41073) */
export const CommunityTabBar = ({
  activeTab,
  onTabChange,
  rightSlot,
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
      <nav
        aria-label="커뮤니티 탭"
        className="flex items-center justify-between"
      >
        <div className="flex items-start gap-6 lg:gap-8">
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
                'relative flex cursor-pointer items-center justify-center self-stretch py-4 text-xl-semibold whitespace-nowrap transition-colors duration-200',
                isActive ? 'text-black-400' : 'text-gray-400'
              )}
            >
              {tab.label}
              {isActive && (
                <motion.span
                  layoutId="tab-indicator"
                  aria-hidden
                  className="absolute bottom-0 left-0 h-0.5 w-full bg-black-400"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
        </div>
        {rightSlot}
      </nav>
    </div>
  );
};
