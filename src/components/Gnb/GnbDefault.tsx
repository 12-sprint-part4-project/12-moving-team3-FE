'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

import MenuIcon from '@/assets/icons/menu.svg';
import ProfileIcon from '@/assets/icons/profile.svg';

import { ChatGnbButton } from '@/components/chat/ChatGnbButton';
import { GNB_NAV_BY_ROLE, type GnbNavItem } from '@/components/Gnb/gnbNav';
import { GnbProfileDropdown } from '@/components/Gnb/GnbProfileDropdown';
import { NotificationGnbButton } from '@/components/Gnb/NotificationGnbButton';
import { Logo } from '@/components/Logo/Logo';
import { Tab } from '@/components/ui/Tab/Tab';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import type { NotificationRole } from '@/types/notification';

export type GnbDefaultSize = 'sm' | 'md' | 'lg';
/** gnb=헤더, tab=탭바, component=헤더+탭 */
export type GnbDefaultSort = 'gnb' | 'tab' | 'component';
/** iconProfile: sm/md, twoMenu: lg 기사, threeMenu: lg 고객 */
export type GnbDefaultMenu = 'iconProfile' | 'twoMenu' | 'threeMenu';

export interface GnbTabItem {
  id: string;
  label: string;
}

export type { GnbNavItem };

export interface GnbDefaultProps {
  size?: GnbDefaultSize;
  sort?: GnbDefaultSort;
  menu?: GnbDefaultMenu;
  userName?: string;
  avatarSrc?: string | null;
  activeTabId?: string;
  tabs?: GnbTabItem[];
  navItems?: GnbNavItem[];
  /** 프로필 드롭다운 메뉴. 미지정 시 고객용 기본값 */
  profileMenuItems?: GnbNavItem[];
  homeHref?: string;
  nameSuffix?: string;
  /** 알림 API role — Header navRole과 동일 */
  notificationRole?: NotificationRole;
  onTabChange?: (tabId: string) => void;
  onAlarmClick?: () => void;
  onProfileClick?: () => void;
  onMenuClick?: () => void;
  onLogout?: () => void;
  className?: string;
}

const DEFAULT_TABS: GnbTabItem[] = [
  { id: 'pending', label: '대기 중인 견적' },
  { id: 'received', label: '받았던 견적' },
];

const NAV_BY_MENU: Record<'twoMenu' | 'threeMenu', GnbNavItem[]> = {
  twoMenu: [...GNB_NAV_BY_ROLE.mover],
  threeMenu: [...GNB_NAV_BY_ROLE.customer],
};

const HEADER_STYLE: Record<GnbDefaultSize, string> = {
  sm: 'h-[3.375rem] px-6 py-2.5',
  md: 'h-[3.375rem] px-[4.5rem] py-2.5',
  lg: 'h-[5.5rem] px-[16.25rem] py-[1.625rem]',
};

const TAB_BAR_STYLE: Record<'sm' | 'md', string> = {
  sm: 'h-[3.375rem] px-6 py-2.5',
  md: 'h-[3.375rem] px-[4.5rem] py-2.5 shadow-[0_0.125rem_0.3125rem] shadow-shadow-gray-100/20',
};

interface GnbTabBarProps {
  size: 'sm' | 'md';
  tabs: GnbTabItem[];
  activeTabId: string;
  onTabChange?: (tabId: string) => void;
}

const GnbTabBar = ({
  size,
  tabs,
  activeTabId,
  onTabChange,
}: GnbTabBarProps) => (
  <div
    className={`flex w-full items-center border-b border-line-100 bg-white ${TAB_BAR_STYLE[size]}`}
  >
    <div className="flex items-center gap-6" role="tablist">
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          active={tab.id === activeTabId}
          onClick={() => onTabChange?.(tab.id)}
        >
          {tab.label}
        </Tab>
      ))}
    </div>
  </div>
);

interface GnbProfileAvatarProps {
  src?: string | null;
  className: string;
}

const GnbProfileAvatar = ({ src, className }: GnbProfileAvatarProps) => {
  if (src) {
    return (
      <span
        className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes="48px"
          className="object-cover object-center"
        />
      </span>
    );
  }

  return <ProfileIcon className={`block shrink-0 ${className}`} aria-hidden />;
};

interface GnbHeaderProps {
  size: GnbDefaultSize;
  userName: string;
  nameSuffix: string;
  avatarSrc?: string | null;
  homeHref: string;
  navItems: GnbNavItem[];
  profileMenuItems?: GnbNavItem[];
  notificationRole: NotificationRole;
  onAlarmClick?: () => void;
  onProfileClick?: () => void;
  onMenuClick?: () => void;
  onLogout?: () => void;
  withBorder?: boolean;
}

const GnbHeader = ({
  size,
  userName,
  nameSuffix,
  avatarSrc,
  homeHref,
  navItems,
  profileMenuItems,
  notificationRole,
  onAlarmClick,
  onProfileClick,
  onMenuClick,
  onLogout,
  withBorder = true,
}: GnbHeaderProps) => {
  const isDesktop = size === 'lg';
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // 채팅·알림·프로필 상호 배타 — 각각 별도 closeSignal
  const [chatCloseSignal, setChatCloseSignal] = useState(0);
  const [notificationCloseSignal, setNotificationCloseSignal] = useState(0);
  const profileRef = useRef<HTMLDivElement>(null);

  useOutsideClick(profileRef, isProfileOpen, setIsProfileOpen);

  const handleChatOpen = () => {
    setIsProfileOpen(false);
    setNotificationCloseSignal((prev) => prev + 1);
  };

  const handleNotificationOpen = () => {
    setIsProfileOpen(false);
    setChatCloseSignal((prev) => prev + 1);
  };

  const handleProfileToggle = () => {
    setChatCloseSignal((prev) => prev + 1);
    setNotificationCloseSignal((prev) => prev + 1);
    setIsProfileOpen((prev) => !prev);
    onProfileClick?.();
  };

  const handleProfileClose = () => {
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    onLogout?.();
  };

  const dropdownSize = size === 'sm' ? 'sm' : 'md';
  const iconSize = isDesktop ? 'lg' : 'sm';

  return (
    <header
      className={`flex w-full items-center bg-white ${HEADER_STYLE[size]} ${
        withBorder ? 'border-b border-line-100' : ''
      }`}
    >
      <div className="flex w-full items-center gap-8">
        <div
          className={`flex shrink-0 items-center ${isDesktop ? 'h-full gap-20' : ''}`}
        >
          <Logo
            size={isDesktop ? 'md' : 'sm'}
            variant={size === 'sm' ? 'icon' : 'iconText'}
            href={homeHref}
          />

          {isDesktop ? (
            <nav className="flex h-full shrink-0 items-center gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="flex h-[5.5rem] shrink-0 items-center py-4 text-2lg-bold whitespace-nowrap text-black-400"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>

        <div
          className={`ml-auto flex shrink-0 items-center justify-end ${
            isDesktop ? 'gap-8' : 'gap-6'
          }`}
        >
          <ChatGnbButton
            size={iconSize}
            onOpen={handleChatOpen}
            closeSignal={chatCloseSignal}
          />

          <NotificationGnbButton
            role={notificationRole}
            size={iconSize}
            onOpen={handleNotificationOpen}
            closeSignal={notificationCloseSignal}
            onAlarmClick={onAlarmClick}
          />

          <div ref={profileRef} className="relative flex items-center">
            {isDesktop ? (
              <button
                type="button"
                aria-label={`${userName} 프로필`}
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
                onClick={handleProfileToggle}
                className="flex shrink-0 cursor-pointer items-center gap-4"
              >
                <GnbProfileAvatar src={avatarSrc} className="size-9" />
                <span className="text-2lg-medium whitespace-nowrap text-black-400">
                  {userName}
                </span>
              </button>
            ) : (
              <button
                type="button"
                aria-label="프로필"
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
                onClick={handleProfileToggle}
                className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center"
              >
                <GnbProfileAvatar src={avatarSrc} className="size-6" />
              </button>
            )}

            {isProfileOpen ? (
              <div className="absolute top-full right-0 z-50 mt-2">
                <GnbProfileDropdown
                  size={dropdownSize}
                  userName={userName}
                  nameSuffix={nameSuffix}
                  menuItems={profileMenuItems}
                  onClose={handleProfileClose}
                  onLogout={handleLogout}
                />
              </div>
            ) : null}
          </div>

          {!isDesktop ? (
            <button
              type="button"
              aria-label="메뉴 열기"
              onClick={onMenuClick}
              className="inline-flex size-6 shrink-0 items-center justify-center [&_path]:stroke-gray-300"
            >
              <MenuIcon className="size-6" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
};

/**
 * 로그인 상태 기본 GNB.
 * Figma "gnb/default"
 * - 브랜드: sm=심볼(icon), md/lg=로고(iconText)
 * - sort=tab: 브랜드 없음(탭만)
 */
export const GnbDefault = ({
  size = 'sm',
  sort = 'gnb',
  menu = 'iconProfile',
  userName = '',
  nameSuffix = '',
  avatarSrc,
  activeTabId = 'pending',
  tabs = DEFAULT_TABS,
  navItems,
  profileMenuItems,
  homeHref = '/',
  notificationRole = 'customer',
  onTabChange,
  onAlarmClick,
  onProfileClick,
  onMenuClick,
  onLogout,
  className = '',
}: GnbDefaultProps) => {
  const resolvedNavItems =
    navItems ??
    (menu === 'twoMenu' || menu === 'threeMenu'
      ? NAV_BY_MENU[menu]
      : NAV_BY_MENU.twoMenu);

  const tabSize: 'sm' | 'md' = size === 'lg' ? 'md' : size;

  if (sort === 'tab') {
    return (
      <div className={className}>
        <GnbTabBar
          size={tabSize}
          tabs={tabs}
          activeTabId={activeTabId}
          onTabChange={onTabChange}
        />
      </div>
    );
  }

  if (sort === 'component') {
    return (
      <div className={`flex flex-col items-stretch ${className}`}>
        <GnbHeader
          size={size === 'lg' ? 'md' : size}
          userName={userName}
          nameSuffix={nameSuffix}
          avatarSrc={avatarSrc}
          homeHref={homeHref}
          navItems={resolvedNavItems}
          profileMenuItems={profileMenuItems}
          notificationRole={notificationRole}
          onAlarmClick={onAlarmClick}
          onProfileClick={onProfileClick}
          onMenuClick={onMenuClick}
          onLogout={onLogout}
          withBorder={false}
        />
        <GnbTabBar
          size={tabSize}
          tabs={tabs}
          activeTabId={activeTabId}
          onTabChange={onTabChange}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <GnbHeader
        size={size}
        userName={userName}
        nameSuffix={nameSuffix}
        avatarSrc={avatarSrc}
        homeHref={homeHref}
        navItems={resolvedNavItems}
        profileMenuItems={profileMenuItems}
        notificationRole={notificationRole}
        onAlarmClick={onAlarmClick}
        onProfileClick={onProfileClick}
        onMenuClick={onMenuClick}
        onLogout={onLogout}
      />
    </div>
  );
};
