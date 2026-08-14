'use client';

import { useState } from 'react';

import MenuIcon from '@/assets/icons/menu.svg';
import ProfileIcon from '@/assets/icons/profile.svg';
import { ChatGnbButton } from '@/components/chat/ChatGnbButton';
import { NotificationGnbButton } from '@/components/Gnb/NotificationGnbButton';
import { Logo } from '@/components/Logo/Logo';
import { Tab } from '@/components/ui/Tab/Tab';

import type { NotificationRole } from '@/types/notification';

export type Gnb2DepthSize = 'sm' | 'md' | 'lg';
/** Figma Property 2 — lg 활성 탭. tab-1=대기 중인 견적, tab-2=받았던 견적 */
export type Gnb2DepthActiveTab = 'tab-1' | 'tab-2';

export interface Gnb2DepthTabItem {
  id: Gnb2DepthActiveTab;
  label: string;
}

export interface Gnb2DepthProps {
  /** 반응형 사이즈. sm=모바일, md=태블릿, lg=PC */
  size?: Gnb2DepthSize;
  /** lg 전용 활성 탭. sm/md에서는 타이틀 라벨로도 사용 */
  activeTab?: Gnb2DepthActiveTab;
  /** sm/md 타이틀바에 표시할 라벨. 미지정 시 활성 탭 라벨 사용 */
  title?: string;
  /** 탭 목록. 미지정 시 Figma 기본값 사용 */
  tabs?: Gnb2DepthTabItem[];
  homeHref?: string;
  /** 알림 API role — Header navRole과 동일 */
  notificationRole?: NotificationRole;
  onTabChange?: (tabId: Gnb2DepthActiveTab) => void;
  onAlarmClick?: () => void;
  onProfileClick?: () => void;
  onMenuClick?: () => void;
  className?: string;
}

const DEFAULT_TABS: Gnb2DepthTabItem[] = [
  { id: 'tab-1', label: '대기 중인 견적' },
  { id: 'tab-2', label: '받았던 견적' },
];

const HEADER_STYLE: Record<'sm' | 'md', string> = {
  sm: 'h-[3.375rem] px-6 py-2.5',
  md: 'h-[3.375rem] px-[4.5rem] py-2.5',
};

const TITLE_BAR_STYLE: Record<'sm' | 'md', string> = {
  sm: 'h-[3.375rem] px-[1.875rem] py-2.5',
  md: 'h-[3.375rem] px-[4.5rem] py-2.5',
};

interface Gnb2DepthHeaderProps {
  size: 'sm' | 'md';
  homeHref: string;
  notificationRole: NotificationRole;
  onAlarmClick?: () => void;
  onProfileClick?: () => void;
  onMenuClick?: () => void;
}

const Gnb2DepthHeader = ({
  size,
  homeHref,
  notificationRole,
  onAlarmClick,
  onProfileClick,
  onMenuClick,
}: Gnb2DepthHeaderProps) => {
  // 채팅·알림 상호 배타 (2Depth는 프로필 드롭다운 없음)
  const [chatCloseSignal, setChatCloseSignal] = useState(0);
  const [notificationCloseSignal, setNotificationCloseSignal] = useState(0);

  const handleChatOpen = () => {
    setNotificationCloseSignal((prev) => prev + 1);
  };

  const handleNotificationOpen = () => {
    setChatCloseSignal((prev) => prev + 1);
  };

  return (
    <header
      className={`flex w-full items-center bg-white ${HEADER_STYLE[size]}`}
    >
      <div className="flex w-full items-center justify-between">
        <Logo
          size="sm"
          variant={size === 'sm' ? 'icon' : 'iconText'}
          href={homeHref}
        />

        <div className="flex shrink-0 items-center justify-end gap-6">
          <ChatGnbButton
            size="sm"
            onOpen={handleChatOpen}
            closeSignal={chatCloseSignal}
          />
          <NotificationGnbButton
            role={notificationRole}
            size="sm"
            onOpen={handleNotificationOpen}
            closeSignal={notificationCloseSignal}
            onAlarmClick={onAlarmClick}
          />
          <button
            type="button"
            aria-label="프로필"
            onClick={onProfileClick}
            className="inline-flex size-6 shrink-0 items-center justify-center"
          >
            <ProfileIcon className="size-6" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={onMenuClick}
            className="inline-flex size-6 shrink-0 items-center justify-center [&_path]:stroke-gray-300"
          >
            <MenuIcon className="size-6" aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
};

interface Gnb2DepthTitleBarProps {
  size: 'sm' | 'md';
  title: string;
}

const Gnb2DepthTitleBar = ({ size, title }: Gnb2DepthTitleBarProps) => (
  <div
    className={`flex w-full items-center border-b border-line-100 bg-white ${TITLE_BAR_STYLE[size]}`}
  >
    <p className="text-2lg-semibold whitespace-nowrap text-black-400">
      {title}
    </p>
  </div>
);

interface Gnb2DepthTabBarProps {
  tabs: Gnb2DepthTabItem[];
  activeTab: Gnb2DepthActiveTab;
  onTabChange?: (tabId: Gnb2DepthActiveTab) => void;
}

const Gnb2DepthTabBar = ({
  tabs,
  activeTab,
  onTabChange,
}: Gnb2DepthTabBarProps) => (
  <div
    className="flex h-20 w-full items-start gap-8 border-b border-line-100 bg-white px-[16.25rem] pt-4 shadow-[0_0.125rem_0.3125rem] shadow-shadow-gray-100/10"
    role="tablist"
  >
    {tabs.map((tab) => (
      <Tab
        key={tab.id}
        variant="depth"
        active={tab.id === activeTab}
        onClick={() => onTabChange?.(tab.id)}
      >
        {tab.label}
      </Tab>
    ))}
  </div>
);

/**
 * 2Depth GNB.
 * Figma "gnb/2-depth" — size=sm|md|lg, Property 2=tab-1|tab-2.
 * - 브랜드: sm=심볼, md=로고, lg=없음(탭바만)
 * - sm/md: 헤더(브랜드·알림·프로필·메뉴) + 타이틀바
 * - lg: 2Depth 탭바만 표시
 */
export const Gnb2Depth = ({
  size = 'sm',
  activeTab = 'tab-2',
  title,
  tabs = DEFAULT_TABS,
  homeHref = '/',
  notificationRole = 'customer',
  onTabChange,
  onAlarmClick,
  onProfileClick,
  onMenuClick,
  className = '',
}: Gnb2DepthProps) => {
  const activeLabel =
    title ??
    tabs.find((tab) => tab.id === activeTab)?.label ??
    DEFAULT_TABS[1].label;

  if (size === 'lg') {
    return (
      <div className={className}>
        <Gnb2DepthTabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-stretch ${className}`}>
      <Gnb2DepthHeader
        size={size}
        homeHref={homeHref}
        notificationRole={notificationRole}
        onAlarmClick={onAlarmClick}
        onProfileClick={onProfileClick}
        onMenuClick={onMenuClick}
      />
      <Gnb2DepthTitleBar size={size} title={activeLabel} />
    </div>
  );
};
