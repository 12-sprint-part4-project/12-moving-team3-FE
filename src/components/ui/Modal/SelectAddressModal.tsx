'use client';

import { useId, useState } from 'react';

import { AddressCard } from '@/components/ui/AddressCard/AddressCard';
import { TextFieldSearch } from '@/components/ui/Input/TextFieldSearch';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import { ModalCtaButton } from './ModalCtaButton';
import { ModalHeader } from './ModalHeader';
import { MODAL_PANEL_CLASS } from './modalPanel';

export interface AddressOption {
  /** 목록에서 선택 구분용 고유 키 */
  id: string;
  zipCode: string;
  roadAddress: string;
  lotAddress: string;
}

export interface SelectAddressModalProps {
  onClose: () => void;
  /** 선택완료 클릭 시 선택된 주소를 전달 */
  onSubmit: (address: AddressOption) => void;
  /** 헤더 제목 (예: '출발지를 선택해주세요', '도착지를 선택해주세요') */
  title?: string;
  /** 검색 결과로 보여줄 주소 목록 */
  addresses?: AddressOption[];
  /** 검색어 변경 시 호출 (호출 측에서 주소 검색 API 연동) */
  onSearchChange?: (query: string) => void;
  onSearch?: (query: string) => void;
  className?: string;
}

/**
 * 주소(출발지/도착지) 선택 모달 콘텐츠 (Figma: Component/modal/address-card).
 * Modal 셸에 대한 의존 없이 패널 UI만 렌더한다.
 */
export const SelectAddressModal = ({
  onClose,
  onSubmit,
  title,
  addresses = [],
  onSearchChange,
  onSearch,
  className = '',
}: SelectAddressModalProps) => {
  const { t } = useTranslation();
  const titleId = useId();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const resolvedTitle = title ?? t('estimateRequest.departureTitle');
  const selectedAddress = addresses.find((item) => item.id === selectedId);
  const isSubmittable = Boolean(selectedAddress);

  const handleSubmit = () => {
    if (!selectedAddress) return;
    onSubmit(selectedAddress);
  };

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={cn(MODAL_PANEL_CLASS, className)}
    >
      <ModalHeader title={resolvedTitle} onClose={onClose} titleId={titleId} />

      <div className="flex w-full flex-col gap-6">
        <TextFieldSearch
          size="md"
          value={query}
          onChange={(event) => {
            const next = event.target.value;
            setQuery(next);
            onSearchChange?.(next);
          }}
          onClear={() => {
            setQuery('');
            onSearchChange?.('');
          }}
          onSearch={() => onSearch?.(query)}
          placeholder={t('common.textPlaceholder')}
          className="!max-w-none"
          aria-label={t('estimateRequest.searchAddressAria')}
        />

        {addresses.length > 0 && (
          <ul className="flex w-full flex-col gap-3">
            {addresses.map((address) => (
              <li key={address.id}>
                <AddressCard
                  zipCode={address.zipCode}
                  roadAddress={address.roadAddress}
                  lotAddress={address.lotAddress}
                  isSelected={selectedId === address.id}
                  onClick={() => setSelectedId(address.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <ModalCtaButton disabled={!isSubmittable} onClick={handleSubmit}>
        {t('estimateRequest.selectComplete')}
      </ModalCtaButton>
    </section>
  );
};
