import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';

import { AddressSelectCard } from './AddressSelectCard';
import { EstimateRequestChatBubbleGroup } from './EstimateRequestChatBubbleGroup';
import { EstimateRequestChatPanel } from './EstimateRequestChatPanel';
import { InlineErrorMessage } from './InlineErrorMessage';

import type { AddressDraft } from './EstimateRequestAddressModal';

const ADDRESS_PROMPT = '이사 지역을 선택해주세요.';

interface AddressSelectSectionProps {
  departure: AddressDraft | null;
  arrival: AddressDraft | null;
  selectDisabled: boolean;
  confirmDisabled: boolean;
  confirmBusy: boolean;
  confirmLabel: string;
  errorMessage: string | null;
  onSelectDeparture: () => void;
  onSelectArrival: () => void;
  onConfirm: () => void;
}

/** AddressStep 전용 — 지역 선택 프롬프트 + 출발/도착 카드 + 에러 */
export const AddressSelectSection = ({
  departure,
  arrival,
  selectDisabled,
  confirmDisabled,
  confirmBusy,
  confirmLabel,
  errorMessage,
  onSelectDeparture,
  onSelectArrival,
  onConfirm,
}: AddressSelectSectionProps) => {
  return (
    <>
      {/* 시스템: 지역 선택 프롬프트 */}
      <EstimateRequestChatBubbleGroup>
        <TextFieldChat>{ADDRESS_PROMPT}</TextFieldChat>
      </EstimateRequestChatBubbleGroup>

      {/* 출발/도착 선택 카드 + 견적 확정(저장·제출) CTA */}
      <EstimateRequestChatPanel>
        <AddressSelectCard
          departure={departure}
          arrival={arrival}
          selectDisabled={selectDisabled}
          confirmDisabled={confirmDisabled}
          confirmBusy={confirmBusy}
          confirmLabel={confirmLabel}
          onSelectDeparture={onSelectDeparture}
          onSelectArrival={onSelectArrival}
          onConfirm={onConfirm}
        />
        <InlineErrorMessage message={errorMessage} />
      </EstimateRequestChatPanel>
    </>
  );
};
