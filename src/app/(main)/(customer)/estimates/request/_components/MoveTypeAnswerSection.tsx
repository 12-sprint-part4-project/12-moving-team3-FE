
import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';
import {
  ESTIMATE_REQUEST_INTRO_MESSAGE,
  MOVE_TYPE_PROMPT_DESKTOP,
  MOVE_TYPE_PROMPT_MOBILE,
} from '@/constants/estimateRequestMessages';

import { EstimateRequestChatBubbleGroup } from './EstimateRequestChatBubbleGroup';
import { MoveTypeRevisePanel } from './MoveTypeRevisePanel';

import type { MoveTypeSelectOption } from '@/constants/estimateRequestOptions';
import type { ApiMoveType } from '@/types/estimateRequest';

/** `useMoveInfoRevise().moveType`과 같은 모양 — 이사종류 질문/답변/수정 값+핸들러 */
export interface MoveTypeAnswerModel {
  label: string | null;
  isRevising: boolean;
  options: ReadonlyArray<MoveTypeSelectOption>;
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
}

/**
 * Step2·3 공용 — 안내+이사종류 질문, 답변+수정하기, 수정 패널.
 * AddressStep·MoveDateStep에 거의 동일하게 중복돼 있던 블록을 추출.
 * 다음 질문은 이 컴포넌트가 감싸지 않는다 — 호출부가 `!moveType.isRevising` 가드로 형제로 이어붙인다.
 */
export const MoveTypeAnswerSection = ({
  moveType,
  isSubmitting,
  isRevisingField,
  errorMessage,
}: MoveTypeAnswerSectionProps) => {
  return (
    <>
      {/* 시스템: 안내 + 이사종류 질문 */}
      <EstimateRequestChatBubbleGroup>
        <TextFieldChat>{ESTIMATE_REQUEST_INTRO_MESSAGE}</TextFieldChat>
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
      ) : null}
    </>
  );
};
