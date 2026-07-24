'use client';

import { useState } from 'react';
import StarIcon from '@/assets/icons/star.svg';

export interface StarRatingProps {
  /** 현재 선택된 점수 (0~MAX) */
  value: number;
  onChange?: (value: number) => void;
  /** true면 표시만 하고 선택은 막는다 (예: 작성된 리뷰 조회) */
  readOnly?: boolean;
  className?: string;
}

/** 별점 만점. 정책상 고정값이며, 추후 정책이 바뀌면 이 값만 수정한다. */
const MAX = 5;

/**
 * 1~MAX점 평점을 선택하는 별점 컴포넌트.
 * 마우스를 올린 별까지 미리 채워 보여주고(hover), 클릭 시 그 값으로 확정한다.
 */
export const StarRating = ({
  value,
  onChange,
  readOnly = false,
  className = '',
}: StarRatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  return (
    <div
      role="radiogroup"
      aria-label="평점"
      className={`flex items-center gap-1 ${className}`}
    >
      {Array.from({ length: MAX }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayValue;

        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={starValue === value}
            aria-label={`${starValue}점`}
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHoverValue(starValue)}
            onMouseLeave={() => !readOnly && setHoverValue(null)}
            onClick={() => !readOnly && onChange?.(starValue)}
            className="disabled:cursor-default"
          >
            <StarIcon
              className={`h-8 w-8 transition-colors sm:h-9 sm:w-9 ${
                isFilled ? 'text-yellow-100' : 'text-gray-100'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
