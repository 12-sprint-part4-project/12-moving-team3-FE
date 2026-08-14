'use client';

import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg';

import type { ButtonHTMLAttributes, HTMLAttributes, RefObject } from 'react';

/*
  PAGINATION

  리스트·테이블 등에서 페이지를 이동하는 컨트롤입니다.
  현재 page와 totalPages는 부모가 관리하는 제어 컴포넌트
  (내부에서 페이지 state를 두지 않고, 부모가 넘긴 page를 그대로 표시)이며,
  페이지 변경은 onPageChange로만 알립니다.

  페이지 번호 윈도우
  - sm: 현재 근처 3개 + 양끝(1, last) + 필요 시 말줄임
  - lg: 현재 근처 5개 + 양끝 + 필요 시 말줄임
  전체 페이지가 윈도우보다 작으면 말줄임 없이 전부 표시합니다.

  [props]
  - size: 'sm' | 'lg'
  - page: number (1-based) — 요청 중에도 부모가 갱신한 값을 넘길 것
  - totalPages: number
  - onPageChange: (page: number) => void
  - scrollOnPageChange: true(window 상단) | RefObject(해당 요소로 scrollIntoView)
  - className: string
*/

type PaginationSize = 'sm' | 'lg';

export interface PaginationProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'onChange'
> {
  size?: PaginationSize;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /**
   * 페이지 변경 시 스크롤.
   * - true: window 최상단
   * - RefObject: 해당 요소로 scrollIntoView({ block: 'start' })
   * 클릭 직후 + page prop 반영 후(레이아웃 안정)에 한 번 더 스크롤한다.
   */
  scrollOnPageChange?: boolean | RefObject<Element | null>;
}

type PageItem = number | 'ellipsis';

const sizeStyles: Record<
  PaginationSize,
  {
    root: string;
    group: string;
    item: string;
    number: string;
    icon: string;
  }
> = {
  sm: {
    root: 'gap-2',
    group: 'gap-1',
    item: 'size-8 rounded-md',
    number: 'text-lg-regular',
    icon: 'size-6',
  },
  lg: {
    root: 'gap-2.5',
    group: 'gap-1',
    item: 'size-12 rounded-lg',
    number: 'text-2lg-regular',
    icon: 'size-6',
  },
};

/**
 * 표시할 페이지 번호 배열을 만듭니다.
 * 예) total=20, page=8, sm → [1, 'ellipsis', 7, 8, 9, 'ellipsis', 20]
 *
 * 양끝(1, last)은 항상 노출하고, 가운데는 현재 페이지 기준 windowSize만큼만 보여
 * 버튼 개수가 과도하게 늘어나지 않게 합니다.
 */
const getPageItems = (
  page: number,
  totalPages: number,
  size: PaginationSize
): PageItem[] => {
  if (totalPages <= 0) {
    return [];
  }

  const windowSize = size === 'sm' ? 3 : 5;

  // 페이지가 적으면 말줄임 없이 전부 나열
  if (totalPages <= windowSize + 2) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PageItem[] = [1];
  const lastPage = totalPages;
  // 현재 페이지를 윈도우 중앙에 가깝게 배치
  let start = Math.max(2, page - Math.floor((windowSize - 1) / 2));
  let end = start + windowSize - 1;

  // 끝쪽에 붙으면 윈도우를 왼쪽으로 밀어 last와 겹치지 않게 함
  if (end >= lastPage) {
    end = lastPage - 1;
    start = Math.max(2, end - windowSize + 1);
  }

  if (start > 2) {
    items.push('ellipsis');
  }

  for (let current = start; current <= end; current += 1) {
    items.push(current);
  }

  if (end < lastPage - 1) {
    items.push('ellipsis');
  }

  items.push(lastPage);

  return items;
};

interface PaginationItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size: PaginationSize;
}

/** 페이지 숫자·화살표·말줄임이 공통으로 쓰는 정사각 버튼 */
const PaginationItem = ({
  size,
  className = '',
  children,
  disabled,
  type = 'button',
  ...rest
}: PaginationItemProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center bg-white p-2.5 disabled:cursor-default ${sizeStyles[size].item} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
};

/** 말줄임(…) — 클릭 불가, 세 점으로 표현 */
const Ellipsis = ({ isActive = false }: { isActive?: boolean }) => {
  return (
    <span
      aria-hidden
      className={`flex items-center gap-0.5 ${
        isActive ? 'text-black-400' : 'text-gray-200'
      }`}
    >
      <span className="size-0.5 rounded-full bg-current" />
      <span className="size-0.5 rounded-full bg-current" />
      <span className="size-0.5 rounded-full bg-current" />
    </span>
  );
};

/** 페이지 변경 후 스크롤 대상 처리 */
const scrollAfterPageChange = (
  scrollOnPageChange: boolean | RefObject<Element | null> | undefined,
  behavior: ScrollBehavior
) => {
  if (!scrollOnPageChange) {
    return;
  }

  if (scrollOnPageChange === true) {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  scrollOnPageChange.current?.scrollIntoView({
    behavior,
    block: 'start',
  });
};

export const Pagination = ({
  size = 'sm',
  page,
  totalPages,
  onPageChange,
  scrollOnPageChange,
  className = '',
  ...rest
}: PaginationProps) => {
  const shouldReduceMotion = useReducedMotion();
  const scrollBehavior: ScrollBehavior = shouldReduceMotion ? 'auto' : 'smooth';
  /** 사용자가 페이지를 바꾼 뒤에만 page 동기화 스크롤 (최초 마운트 제외) */
  const hasUserChangedPageRef = useRef(false);
  const prevPageRef = useRef(page);

  // 범위를 벗어나면 클램프해 잘못된 page prop에도 UI가 깨지지 않게 함
  const currentPage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  const pageItems = getPageItems(currentPage, totalPages, size);
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePageChange = (nextPage: number) => {
    // 동일 페이지·범위 밖 클릭은 무시해 불필요한 리렌더/요청 방지
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) {
      return;
    }
    hasUserChangedPageRef.current = true;
    onPageChange(nextPage);
    // 즉시 스크롤 (체감 반응) — 목록 remount 후에는 effect가 한 번 더 맞춤
    scrollAfterPageChange(scrollOnPageChange, scrollBehavior);
  };

  // page prop 반영·레이아웃 안정 후 재스크롤 (placeholder/데이터 교체 대응)
  useEffect(() => {
    if (!scrollOnPageChange || !hasUserChangedPageRef.current) {
      prevPageRef.current = page;
      return;
    }
    if (prevPageRef.current === page) {
      return;
    }
    prevPageRef.current = page;

    const frameId = window.requestAnimationFrame(() => {
      scrollAfterPageChange(scrollOnPageChange, scrollBehavior);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [page, scrollOnPageChange, scrollBehavior]);

  return (
    <nav
      aria-label="페이지네이션"
      className={`inline-flex items-start ${sizeStyles[size].root} ${className}`.trim()}
      {...rest}
    >
      <PaginationItem
        size={size}
        disabled={!canGoPrev}
        aria-label="이전 페이지"
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <ChevronLeftIcon
          aria-hidden
          className={`${sizeStyles[size].icon} ${
            canGoPrev ? '[&_path]:stroke-black-400' : '[&_path]:stroke-gray-200'
          }`}
        />
      </PaginationItem>

      <div className={`flex items-start ${sizeStyles[size].group}`}>
        {pageItems.map((item, index) => {
          if (item === 'ellipsis') {
            return (
              <PaginationItem
                key={`ellipsis-${index}`}
                size={size}
                disabled
                tabIndex={-1}
                aria-hidden
              >
                <Ellipsis />
              </PaginationItem>
            );
          }

          const isActive = item === currentPage;

          return (
            <PaginationItem
              key={item}
              size={size}
              aria-label={`${item}페이지`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => handlePageChange(item)}
            >
              <span
                className={`text-center whitespace-nowrap ${
                  isActive
                    ? size === 'sm'
                      ? 'text-lg-semibold text-black-400'
                      : 'text-2lg-semibold text-black-400'
                    : `${sizeStyles[size].number} text-gray-200`
                }`}
              >
                {item}
              </span>
            </PaginationItem>
          );
        })}
      </div>

      <PaginationItem
        size={size}
        disabled={!canGoNext}
        aria-label="다음 페이지"
        onClick={() => handlePageChange(currentPage + 1)}
      >
        <ChevronRightIcon
          aria-hidden
          className={`${sizeStyles[size].icon} ${
            canGoNext ? '[&_path]:stroke-black-400' : '[&_path]:stroke-gray-200'
          }`}
        />
      </PaginationItem>
    </nav>
  );
};
