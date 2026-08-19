'use client';

import { TextArea } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

import type { ComponentProps } from 'react';

type MoverProfileTextAreaProps = Omit<ComponentProps<typeof TextArea>, 'size'>;

/** 기사님 프로필 폼 공통 텍스트영역. 높이·너비를 고정한다. */
export const MoverProfileTextArea = ({
  className = '',
  ...props
}: MoverProfileTextAreaProps) => {
  return (
    <TextArea
      size="sm"
      className={cn(
        'w-full [&_>div]:min-h-40 [&_>div]:w-full [&_>div]:max-w-full [&_textarea]:lg:text-xl-regular',
        className
      )}
      {...props}
    />
  );
};
