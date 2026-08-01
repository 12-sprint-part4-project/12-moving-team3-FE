'use client';

import { AddressSelectCard } from '../AddressSelectCard';
import { EstimateRequestChatBubbleGroup } from '../EstimateRequestChatBubbleGroup';
import { EstimateRequestChatPanel } from '../EstimateRequestChatPanel';
import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';
import { useCustomerEstimateRequest } from '@/hooks/useCustomerEstimateRequest';
import type { ApiMoveType } from '@/types/estimateRequest';

/** Step1·2와 동일 옵션 — 답변 라벨 표시용 */
const MOVE_TYPE_OPTIONS: ReadonlyArray<{
  value: ApiMoveType;
  label: string;
}> = [
  { value: 'SMALL', label: '소형이사 (원룸, 투룸, 20평대 미만)' },
  { value: 'HOME', label: '가정이사 (쓰리룸, 20평대 이상)' },
  { value: 'OFFICE', label: '사무실이사 (사무실, 상업공간)' },
];

const INTRO_MESSAGE =
  '몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)';
const MOVE_TYPE_PROMPT_MOBILE = '이사 종류를 알려주세요.';
const MOVE_TYPE_PROMPT_DESKTOP = '이사 종류를 선택해 주세요.';
const MOVE_DATE_PROMPT = '이사 예정일을 선택해주세요.';
const ADDRESS_PROMPT = '이사 지역을 선택해주세요.';

/** YYYY-MM-DD → 채팅 버블용 「YYYY년 M월 D일」 (시안 표기) */
const formatChatMoveDate = (moveDate: string): string => {
  const [year, month, day] = moveDate.slice(0, 10).split('-').map(Number);
  if (!year || !month || !day) {
    return moveDate;
  }
  return `${year}년 ${month}월 ${day}일`;
};

/**
 * 스텝3 — 출발지/도착지 선택 UI (스프린트 B).
 * 채팅 히스토리 + empty 선택 카드. 모달·API는 스프린트 C/D.
 */
export const AddressStep = () => {
  const { bootstrap } = useCustomerEstimateRequest();
  const detail = bootstrap.detail;
  const moveTypeLabel =
    MOVE_TYPE_OPTIONS.find((option) => option.value === detail?.moveType)
      ?.label ?? null;
  const moveDateLabel = detail?.moveDate
    ? formatChatMoveDate(detail.moveDate)
    : null;

  return (
    <section
      aria-label="출발지 도착지 입력"
      className="mx-auto flex w-full max-w-[375px] flex-col gap-2 px-6 md:max-w-[1448px] md:gap-6"
    >
      {/* 시스템: 안내 + 이사종류 질문 */}
      <EstimateRequestChatBubbleGroup>
        <TextFieldChat>{INTRO_MESSAGE}</TextFieldChat>
        <TextFieldChat desktopChildren={MOVE_TYPE_PROMPT_DESKTOP}>
          {MOVE_TYPE_PROMPT_MOBILE}
        </TextFieldChat>
      </EstimateRequestChatBubbleGroup>

      {/* 유저: 이사종류 답변 + 수정하기 (클릭은 C/D에서 연동, UI만) */}
      {moveTypeLabel ? (
        <EstimateRequestChatBubbleGroup align="end">
          <TextFieldChat color="mePrimary">{moveTypeLabel}</TextFieldChat>
          <button
            type="button"
            className="pr-2 text-xs-medium text-gray-500 underline md:text-lg-medium"
          >
            수정하기
          </button>
        </EstimateRequestChatBubbleGroup>
      ) : null}

      {/* 시스템: 날짜 프롬프트 */}
      <EstimateRequestChatBubbleGroup>
        <TextFieldChat>{MOVE_DATE_PROMPT}</TextFieldChat>
      </EstimateRequestChatBubbleGroup>

      {/* 유저: 날짜 답변 + 수정하기 (UI만) */}
      {moveDateLabel ? (
        <EstimateRequestChatBubbleGroup align="end">
          <TextFieldChat color="mePrimary">{moveDateLabel}</TextFieldChat>
          <button
            type="button"
            className="pr-2 text-xs-medium text-gray-500 underline md:text-lg-medium"
          >
            수정하기
          </button>
        </EstimateRequestChatBubbleGroup>
      ) : null}

      {/* 시스템: 지역 선택 프롬프트 */}
      <EstimateRequestChatBubbleGroup>
        <TextFieldChat>{ADDRESS_PROMPT}</TextFieldChat>
      </EstimateRequestChatBubbleGroup>

      {/* 출발/도착 선택 카드 — ChatPanel, md+ 우측 정렬 */}
      <EstimateRequestChatPanel>
        <AddressSelectCard />
      </EstimateRequestChatPanel>
    </section>
  );
};
