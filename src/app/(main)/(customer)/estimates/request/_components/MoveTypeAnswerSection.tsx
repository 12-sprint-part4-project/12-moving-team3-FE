
import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';

import { EstimateRequestChatBubbleGroup } from './EstimateRequestChatBubbleGroup';
import { MoveTypeRevisePanel } from './MoveTypeRevisePanel';

import type { ApiMoveType } from '@/types/estimateRequest';
import type { ReactNode } from 'react';

const INTRO_MESSAGE =
  '몇 가지 정보만 알려주시면 최대 5개의 견적을 받을 수 있어요 :)';
const MOVE_TYPE_PROMPT_MOBILE = '이사 종류를 알려주세요.';
const MOVE_TYPE_PROMPT_DESKTOP = '이사 종류를 선택해 주세요.';

interface MoveTypeOption {
  value: ApiMoveType;
  label: string;
}

/** `useMoveInfoRevise().moveType`과 같은 모양 — 이사종류 질문/답변/수정 값+핸들러 */
export interface MoveTypeAnswerModel {
  label: string | null;
  isRevising: boolean;
  options: ReadonlyArray<MoveTypeOption>;
  draft: ApiMoveType | null;
  setDraft: (value: ApiMoveType) => void;
  canConfirm: boolean;
  start: () => void;
  confirm: () => Promise<void>;
}

interface MoveTypeAnswerSectionProps {
  moveType: MoveTypeAnswerModel;
  isSubmitting: boolean;
  isRevisingField: boolean;
  errorMessage: string | null;
  /** 수정 모드가 아닐 때 이 자리에 이어서 렌더할 다음 질문 블록 */
  children: ReactNode;
}

/**
 * Step2·3 공용 — 안내+이사종류 질문, 답변+수정하기, 수정 패널.
 * AddressStep·MoveDateStep에 거의 동일하게 중복돼 있던 블록을 추출.
 */
export const MoveTypeAnswerSection = ({
  moveType,
  isSubmitting,
  isRevisingField,
  errorMessage,
  children,
}: MoveTypeAnswerSectionProps) => {
  return (
    <>
      {/* 시스템: 안내 + 이사종류 질문 */}
      <EstimateRequestChatBubbleGroup>
        <TextFieldChat>{INTRO_MESSAGE}</TextFieldChat>
        <TextFieldChat desktopChildren={MOVE_TYPE_PROMPT_DESKTOP}>
          {MOVE_TYPE_PROMPT_MOBILE}
        </TextFieldChat>
      </EstimateRequestChatBubbleGroup>

      {/* 유저: 이사종류 답변 + 수정하기 (수정 모드 중에는 숨김) */}
      {moveType.label && !moveType.isRevising ? (
        <EstimateRequestChatBubbleGroup align="end">
          <TextFieldChat color="mePrimary">{moveType.label}</TextFieldChat>
          <button
            type="button"
            className="pr-2 text-xs-medium text-gray-500 underline md:text-lg-medium"
            disabled={isSubmitting}
            onClick={moveType.start}
          >
            수정하기
          </button>
        </EstimateRequestChatBubbleGroup>
      ) : null}

      {moveType.isRevising ? (
        <MoveTypeRevisePanel
          options={moveType.options}
          draftMoveType={moveType.draft}
          onSelect={moveType.setDraft}
          isSubmitting={isSubmitting}
          isRevisingField={isRevisingField}
          canConfirm={moveType.canConfirm}
          errorMessage={errorMessage}
          onConfirm={() => {
            void moveType.confirm();
          }}
        />
      ) : (
        children
      )}
    </>
  );
};
