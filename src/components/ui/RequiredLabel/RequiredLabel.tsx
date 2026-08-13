'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface RequiredLabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

const LABEL_CLASSNAME = 'text-lg-semibold text-black-300 lg:text-xl-semibold';

/**
 * 필수 입력 라벨. 텍스트 옆 파란 * 표시.
 * htmlFor가 있으면 label, 없으면 h2.
 */
export const RequiredLabel = ({
  htmlFor,
  children,
  className,
}: RequiredLabelProps) => {
  const content = (
    <>
      <span>{children}</span>
      <span className="text-blue-300" aria-hidden>
        *
      </span>
    </>
  );

  if (htmlFor) {
    return (
      <label
        htmlFor={htmlFor}
        className={cn(LABEL_CLASSNAME, 'flex items-center gap-1', className)}
      >
        {content}
      </label>
    );
  }

  return (
    <h2 className={cn(LABEL_CLASSNAME, 'flex items-center gap-1', className)}>
      {content}
    </h2>
  );
};
