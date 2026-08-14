'use client';

import { TextFieldOutlined } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

import type { ComponentProps } from 'react';

type CustomerProfileTextFieldProps = Omit<
  ComponentProps<typeof TextFieldOutlined>,
  'size'
>;

/** 고객 프로필 폼 공통 입력. 높이·너비를 고정한다. */
export const CustomerProfileTextField = ({
  className = '',
  ...props
}: CustomerProfileTextFieldProps) => {
  return (
    <TextFieldOutlined
      size="sm"
      className={cn(
        'w-full [&_>div]:min-h-[3.375rem] [&_>div]:w-full [&_>div]:max-w-full lg:[&_>div]:min-h-16 lg:[&_>div]:text-xl-regular',
        className
      )}
      {...props}
    />
  );
};
