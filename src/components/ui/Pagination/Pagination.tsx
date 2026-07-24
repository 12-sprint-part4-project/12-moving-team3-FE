'use client';

import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg';

/*
  PAGINATION

  [props]
  - size: 'sm' | 'lg'
  - page: number
  - totalPages: number
  - onPageChange: (page: number) => void
  - className: string
*/

type PaginationSize = 'sm' | 'lg';

interface PaginationProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'onChange'
> {
  size?: PaginationSize;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
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

const getPageItems = (
  page: number,
  totalPages: number,
  size: PaginationSize
): PageItem[] => {
  if (totalPages <= 0) {
    return [];
  }

  const windowSize = size === 'sm' ? 3 : 5;

  if (totalPages <= windowSize + 1) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PageItem[] = [];
  const lastPage = totalPages;
  let start = Math.max(1, page - Math.floor((windowSize - 1) / 2));
  let end = start + windowSize - 1;

  if (end >= lastPage) {
    end = lastPage - 1;
    start = Math.max(1, end - windowSize + 1);
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
      className={`inline-flex shrink-0 items-center justify-center bg-white p-2.5 disabled:cursor-not-allowed ${sizeStyles[size].item} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
};

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

export const Pagination = ({
  size = 'sm',
  page,
  totalPages,
  onPageChange,
  className = '',
  ...rest
}: PaginationProps) => {
  const currentPage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  const pageItems = getPageItems(currentPage, totalPages, size);
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) {
      return;
    }
    onPageChange(nextPage);
  };

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
