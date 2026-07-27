'use client';

import { useControllableValue } from '@/hooks/useControllableValue';

export type TabButtonSize = 'sm' | 'md';

export interface TabButtonItem {
  id: string;
  label: string;
}

export interface TabButtonProps {
  /**
   * 사이즈.
   * - sm: Figma Property 1=Tab-button, Property 2=sm
   * - md: Figma Property 1=Tab, Property 2=md
   */
  size?: TabButtonSize;
  /** 탭 목록. 미지정 시 Figma 기본값 사용 */
  items?: TabButtonItem[];
  /** 현재 활성 탭 id (controlled) */
  value?: string;
  /** 초기 활성 탭 id (uncontrolled) */
  defaultValue?: string;
  /** 탭 선택 시 호출 */
  onValueChange?: (value: string) => void;
  className?: string;
}

const DEFAULT_ITEMS: TabButtonItem[] = [
  { id: 'pending', label: '대기 중인 견적' },
  { id: 'received', label: '받았던 견적' },
];

const ROOT_STYLE: Record<TabButtonSize, string> = {
  sm: 'w-[20.4375rem]',
  md: 'w-[15.875rem]',
};

/**
 * 세그먼트 탭 버튼.
 * Figma "Tab-button" — Property 1=Tab-button|Tab, Property 2=sm|md.
 */
export const TabButton = ({
  size = 'sm',
  items = DEFAULT_ITEMS,
  value,
  defaultValue,
  onValueChange,
  className = '',
}: TabButtonProps) => {
  const [activeId, setActiveId] = useControllableValue(
    value,
    defaultValue ?? items[0]?.id ?? '',
    onValueChange
  );

  return (
    <div
      role="tablist"
      className={`flex items-center justify-center gap-2.5 rounded-xl bg-line-100 p-1.5 shadow-[-0.125rem_-0.125rem_0.125rem_0_rgb(220_220_220/0.16),0.125rem_0.125rem_0.125rem_0_rgb(220_220_220/0.16)] ${ROOT_STYLE[size]} ${className}`}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveId(item.id)}
            className={`flex flex-1 items-center justify-center rounded-lg px-2.5 py-1.5 text-center whitespace-nowrap ${
              isActive
                ? 'bg-white text-md-semibold text-black-400 shadow-[0.25rem_0.25rem_0.3125rem] shadow-shadow-gray-300/10'
                : 'text-md-medium text-gray-300'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
