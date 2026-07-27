import Link from 'next/link';

import AlarmIcon from '@/assets/icons/alarm.svg';
import MenuIcon from '@/assets/icons/menu.svg';
import ProfileIcon from '@/assets/icons/profile.svg';

import {
  GNB_NAV_BY_ROLE,
  type GnbNavItem,
} from '@/components/Gnb/gnbNav';
import { Logo } from '@/components/Logo/Logo';
import { Tab } from '@/components/ui/Tab/Tab';

export type GnbDefaultSize = 'sm' | 'md' | 'lg';
/** Figma Property 1(sort): gnb=헤더, tab=탭바, component=헤더+탭 */
export type GnbDefaultSort = 'gnb' | 'tab' | 'component';
/**
 * Figma Property 2(sort-2).
 * - iconProfile: sm/md 헤더 (알림·프로필·메뉴)
 * - twoMenu: lg 기사 네비 (받은 요청, 내 견적 관리)
 * - threeMenu: lg 고객 네비 (견적 요청, 기사님 찾기, 내 견적 관리)
 */
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
  /** lg 프로필 옆에 표시할 사용자 이름 */
  userName?: string;
  /** 현재 활성 탭 id (tab / component) */
  activeTabId?: string;
  /** 탭 목록. 미지정 시 Figma 기본값 사용 */
  tabs?: GnbTabItem[];
  /** lg 네비 링크. 미지정 시 menu 기본값 사용 */
  navItems?: GnbNavItem[];
  homeHref?: string;
  onTabChange?: (tabId: string) => void;
  onAlarmClick?: () => void;
  onProfileClick?: () => void;
  onMenuClick?: () => void;
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

interface GnbHeaderProps {
  size: GnbDefaultSize;
  userName: string;
  homeHref: string;
  navItems: GnbNavItem[];
  onAlarmClick?: () => void;
  onProfileClick?: () => void;
  onMenuClick?: () => void;
  withBorder?: boolean;
}

const GnbHeader = ({
  size,
  userName,
  homeHref,
  navItems,
  onAlarmClick,
  onProfileClick,
  onMenuClick,
  withBorder = true,
}: GnbHeaderProps) => {
  const isDesktop = size === 'lg';

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
          <button
            type="button"
            aria-label="알림"
            onClick={onAlarmClick}
            className={`inline-flex shrink-0 items-center justify-center text-gray-200 ${
              isDesktop ? 'size-9' : 'size-6'
            }`}
          >
            <AlarmIcon
              className={isDesktop ? 'size-9' : 'size-6'}
              aria-hidden
            />
          </button>

          {isDesktop ? (
            <button
              type="button"
              aria-label={`${userName} 프로필`}
              onClick={onProfileClick}
              className="flex shrink-0 items-center gap-4"
            >
              <ProfileIcon className="size-9 shrink-0" aria-hidden />
              <span className="text-2lg-medium whitespace-nowrap text-black-400">
                {userName}
              </span>
            </button>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
};

/**
 * 로그인 상태 기본 GNB.
 * Figma "gnb/default" — sort=gnb|tab|component, size=sm|md|lg.
 */
export const GnbDefault = ({
  size = 'sm',
  sort = 'gnb',
  menu = 'iconProfile',
  userName = '김가나',
  activeTabId = 'pending',
  tabs = DEFAULT_TABS,
  navItems,
  homeHref = '/',
  onTabChange,
  onAlarmClick,
  onProfileClick,
  onMenuClick,
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
          homeHref={homeHref}
          navItems={resolvedNavItems}
          onAlarmClick={onAlarmClick}
          onProfileClick={onProfileClick}
          onMenuClick={onMenuClick}
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
        homeHref={homeHref}
        navItems={resolvedNavItems}
        onAlarmClick={onAlarmClick}
        onProfileClick={onProfileClick}
        onMenuClick={onMenuClick}
      />
    </div>
  );
};
