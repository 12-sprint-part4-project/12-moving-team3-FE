'use client';

import { TextFieldOutlined } from '@/components/ui/Input';
import { RequiredLabel } from '@/components/ui/RequiredLabel/RequiredLabel';
import {
  formatKrMobileSubscriberInput,
  KR_MOBILE_PREFIX_LABEL,
} from '@/lib/phoneNumber';
import { cn } from '@/lib/utils';

import type { ChangeEvent } from 'react';

interface ProfilePhoneFieldProps {
  id: string;
  value: string;
  errorMessage?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

/** 전화번호 필드. 010 접두어와 구독자 번호 입력을 고정한다. */
export const ProfilePhoneField = ({
  id,
  value,
  errorMessage,
  onChange,
  className = '',
}: ProfilePhoneFieldProps) => {
  const isError = Boolean(errorMessage);

  return (
    <section
      className={cn('flex w-full flex-col items-start gap-4', className)}
    >
      <RequiredLabel htmlFor={id}>전화번호</RequiredLabel>
      <TextFieldOutlined
        id={id}
        size="sm"
        type="tel"
        name="phone"
        inputMode="numeric"
        autoComplete="tel"
        leftAddon={KR_MOBILE_PREFIX_LABEL}
        placeholder="1234-5678"
        value={formatKrMobileSubscriberInput(value)}
        onChange={onChange}
        isError={isError}
        errorMessage={errorMessage}
        className="w-full [&_>div]:min-h-[3.375rem] [&_>div]:w-full [&_>div]:max-w-full lg:[&_>div]:min-h-16 lg:[&_>div]:text-xl-regular"
      />
    </section>
  );
};
