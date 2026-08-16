'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** 등록 직후 카드 강조 유지 시간(ms) */
const REVIEW_HIGHLIGHT_DURATION_MS = 1000;

interface UseHighlightWrittenReviewParams {
  highlightReviewId: number | null;
  reviews: { id: number }[];
  isPending: boolean;
  isError: boolean;
}

/**
 * 작성 직후 리뷰 카드 강조.
 * 목록에 보이면 스크롤하고, duration 후 highlight 쿼리를 제거한다.
 */
export const useHighlightWrittenReview = ({
  highlightReviewId,
  reviews,
  isPending,
  isError,
}: UseHighlightWrittenReviewParams) => {
  const router = useRouter();
  const cardRef = useRef<HTMLButtonElement>(null);
  const handledReviewIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (highlightReviewId === null) {
      handledReviewIdRef.current = null;
      return;
    }

    if (
      isPending ||
      isError ||
      handledReviewIdRef.current === highlightReviewId
    ) {
      return;
    }

    const isHighlightedReviewVisible = reviews.some(
      (review) => review.id === highlightReviewId
    );
    if (!isHighlightedReviewVisible) {
      return;
    }

    handledReviewIdRef.current = highlightReviewId;

    cardRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    const timer = window.setTimeout(() => {
      router.replace('/reviews?tab=written');
    }, REVIEW_HIGHLIGHT_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [highlightReviewId, isError, isPending, reviews, router]);

  const isHighlighted = (reviewId: number) => highlightReviewId === reviewId;

  return { cardRef, isHighlighted };
};
