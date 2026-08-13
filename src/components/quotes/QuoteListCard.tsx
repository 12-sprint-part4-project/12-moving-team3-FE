'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { QuoteCardInfo } from '@/components/quotes/QuoteCardInfo';
import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { cardHover } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';
import type { MoveTypeOption } from '@/types/estimateRequest';

export interface QuoteListCardProps {
  displayName: string;
  nameSuffix?: string;
  moveType: MoveTypeOption | null;
  isConfirmed?: boolean;
  isDesignated: boolean;
  moveDate: string;
  departure: string;
  arrival: string;
  priceLabel?: string;
  /** 확정·생성 시각 상대 표기 (데스크톱) */
  relativeTimeLabel?: string;
  detailHref: string;
  detailAriaLabel: string;
  isClosed?: boolean;
  overlayMessage?: string;
  className?: string;
  /** 칩 영역 커스텀 (반려 칩 등) */
  chips?: ReactNode;
  /**
   * `/quotes/history` 등 — 본문 전체 링크 대신 하단 CTA([상세보기][채팅하기]).
   * 전달 시 본문은 링크가 아니며 footerActions를 렌더한다.
   */
  footerActions?: ReactNode;
}

/**
 * 보낸 견적·이용 내역 공통 카드
 * Figma Card-list/확정 견적 · Card-list/이사완료
 */
export const QuoteListCard = ({
  displayName,
  nameSuffix = '고객님',
  moveType,
  isConfirmed = false,
  isDesignated,
  moveDate,
  departure,
  arrival,
  priceLabel,
  relativeTimeLabel,
  detailHref,
  detailAriaLabel,
  isClosed = false,
  overlayMessage,
  className = '',
  chips,
  footerActions,
}: QuoteListCardProps) => {
  const shouldReduceMotion = useReducedMotion();

  const defaultChips = (
    <>
      {isConfirmed ? (
        <MoveTypeChip type="quoteConfirmed" size="sm">
          견적 확정
        </MoveTypeChip>
      ) : null}
      {moveType ? <MoveTypeChip type={moveType} size="sm" /> : null}
      {isDesignated ? <MoveTypeChip type="designated" size="sm" /> : null}
    </>
  );

  const cardBody = (
    <>
      <div className="flex w-full items-center justify-between gap-2 lg:gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2 lg:gap-3">
          {chips ?? defaultChips}
        </div>
        {relativeTimeLabel ? (
          <p className="hidden shrink-0 text-xs-regular text-gray-500 md:block">
            {relativeTimeLabel}
          </p>
        ) : null}
      </div>

      <QuoteCardInfo
        displayName={displayName}
        nameSuffix={nameSuffix}
        moveDate={moveDate}
        departure={departure}
        arrival={arrival}
      />

      {priceLabel ? (
        <div className="flex w-full items-end justify-end gap-2 lg:h-10 lg:gap-4">
          <p className="text-md-medium text-black-400 lg:text-2lg-medium">
            견적 금액
          </p>
          <p className="text-2lg-bold text-black-400 lg:text-2xl-bold">
            {priceLabel}
          </p>
        </div>
      ) : null}
    </>
  );

  const useFooterActions = Boolean(footerActions) && !isClosed;

  return (
    <motion.article
      {...(shouldReduceMotion ? {} : cardHover)}
      className={cn(
        'relative flex h-full w-full flex-col gap-6.5 overflow-hidden rounded-2xl border border-line-100 bg-white px-3.5 py-4 shadow-request-card transition-shadow hover:shadow-md lg:gap-4 lg:px-6 lg:pt-5 lg:pb-3',
        className
      )}
    >
      {isClosed || useFooterActions ? (
        <div className="flex w-full flex-1 flex-col gap-6.5 lg:gap-4">
          {cardBody}
        </div>
      ) : (
        <Link
          href={detailHref}
          className="flex w-full flex-1 flex-col gap-6.5 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 lg:gap-4"
          aria-label={detailAriaLabel}
        >
          {cardBody}
        </Link>
      )}

      {useFooterActions ? (
        <div className="flex w-full flex-col gap-2 md:flex-row md:gap-3">
          {footerActions}
        </div>
      ) : null}

      {isClosed && overlayMessage ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-300 bg-black-500/65">
          <p className="text-lg-semibold text-white lg:text-2lg-semibold">
            {overlayMessage}
          </p>
          <Link
            href={detailHref}
            aria-label={`${detailAriaLabel} — ${overlayMessage}`}
            className="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-blue-100 px-4 py-2 text-md-semibold text-blue-300 transition-colors hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:outline-none lg:px-4.5 lg:py-2.5 lg:text-lg-semibold"
          >
            견적 상세보기
          </Link>
        </div>
      ) : null}
    </motion.article>
  );
};
