'use client';

import { Pagination } from './Pagination';

import type { PaginationProps } from './Pagination';

/*
  RESPONSIVE PAGINATION

  size는 CSS가 아니라 페이지 번호 윈도우(sm=3, lg=5)까지 바꾸므로
  한 인스턴스로 반응형 처리할 수 없다. breakpoint 미만은 sm, 이상은 lg를
  각각 렌더하고 CSS로 하나만 보여 준다.
*/

type PaginationBreakpoint = 'lg' | 'xl';

const wrapperClassByBreakpoint: Record<
  PaginationBreakpoint,
  { sm: string; lg: string }
> = {
  lg: {
    sm: 'flex justify-center lg:hidden',
    lg: 'hidden justify-center lg:flex',
  },
  xl: {
    sm: 'flex justify-center xl:hidden',
    lg: 'hidden justify-center xl:flex',
  },
};

export interface ResponsivePaginationProps extends Omit<
  PaginationProps,
  'size'
> {
  /** 이 구간부터 Pagination lg. 기본 lg */
  breakpoint?: PaginationBreakpoint;
}

export const ResponsivePagination = ({
  breakpoint = 'lg',
  ...paginationProps
}: ResponsivePaginationProps) => {
  const wrapperClass = wrapperClassByBreakpoint[breakpoint];

  return (
    <>
      <div className={wrapperClass.sm}>
        <Pagination size="sm" {...paginationProps} />
      </div>
      <div className={wrapperClass.lg}>
        <Pagination size="lg" {...paginationProps} />
      </div>
    </>
  );
};
