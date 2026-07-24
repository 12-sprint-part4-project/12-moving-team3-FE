'use client';

import { useId, useState } from 'react';
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
 * button+role="radio"로 라디오 패턴을 직접 구현하는 대신, input[type="radio"] + label로
 * 구성된 네이티브 라디오 그룹을 사용한다 — 화살표 키/Home/End 탐색, 포커스 이동(roving tabIndex)
 * 등을 브라우저가 기본으로 제공해 별도 onKeyDown 구현이 필요 없다.
 * 마우스를 올린 별까지 미리 채워 보여주고(hover), 선택 시 그 값으로 확정한다.
 */
export const StarRating = ({
  value,
  onChange,
  readOnly = false,
  className = '',
}: StarRatingProps) => {
  const name = useId();
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  return (
    <fieldset
      className={`m-0 flex items-center gap-1 border-none p-0 ${className}`}
      onMouseLeave={() => !readOnly && setHoverValue(null)}
    >
      <legend className="sr-only">평점</legend>
      {Array.from({ length: MAX }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayValue;

        return (
          <label
            key={starValue}
            aria-label={`${starValue}점`}
            className={readOnly ? 'cursor-default' : 'cursor-pointer'}
            onMouseEnter={() => !readOnly && setHoverValue(starValue)}
          >
            <input
              type="radio"
              name={name}
              value={starValue}
              checked={starValue === value}
              disabled={readOnly}
              onChange={() => onChange?.(starValue)}
              className="sr-only"
            />
            <StarIcon
              className={`h-8 w-8 transition-colors sm:h-9 sm:w-9 ${
                isFilled ? 'text-yellow-100' : 'text-gray-100'
              }`}
            />
          </label>
        );
      })}
    </fieldset>
  );
};
