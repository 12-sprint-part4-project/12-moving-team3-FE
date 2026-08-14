import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';

import { EstimateRequestChatBubbleGroup } from './EstimateRequestChatBubbleGroup';

interface AnswerWithReviseButtonProps {
  label: string;
  disabled: boolean;
  onRevise: () => void;
}

/** 유저 답변 말풍선 + "수정하기" 버튼 — MoveTypeAnswerSection·AddressStep(moveDate) 공용 */
export const AnswerWithReviseButton = ({
  label,
  disabled,
  onRevise,
}: AnswerWithReviseButtonProps) => (
  <EstimateRequestChatBubbleGroup align="end">
    <TextFieldChat color="mePrimary">{label}</TextFieldChat>
    <button
      type="button"
      className="pr-2 text-xs-medium text-gray-500 underline md:text-lg-medium"
      disabled={disabled}
      onClick={onRevise}
    >
      수정하기
    </button>
  </EstimateRequestChatBubbleGroup>
);
