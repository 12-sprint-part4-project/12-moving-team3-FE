'use client';

import { TextFieldSearch } from '@/components/ui/Input/TextFieldSearch';
import { cn } from '@/lib/utils';

import type { ChangeEvent } from 'react';

interface CommunitySearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  size?: 'sm' | 'md';
  className?: string;
  inputClassName?: string;
}

/** 커뮤니티 게시글 검색 — Mobile/Tablet·Desktop 공통 */
export const CommunitySearchField = ({
  value,
  onChange,
  onSearch,
  size = 'sm',
  className = '',
  inputClassName = '',
}: CommunitySearchFieldProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={cn(className)}>
      <TextFieldSearch
        size={size}
        value={value}
        onChange={handleChange}
        onClear={handleClear}
        onSearch={onSearch}
        className={inputClassName}
        placeholder="검색어를 입력해 주세요."
        aria-label="게시글 검색"
      />
    </div>
  );
};
