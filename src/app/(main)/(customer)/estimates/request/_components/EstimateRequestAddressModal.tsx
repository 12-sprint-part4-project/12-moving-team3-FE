'use client';

import { useId, useState } from 'react';

import { AddressCard } from '@/components/ui/AddressCard/AddressCard';
import { TextFieldOutlined } from '@/components/ui/Input/TextFieldOutlined';
import { TextFieldSearch } from '@/components/ui/Input/TextFieldSearch';
import { Modal } from '@/components/ui/Modal/Modal';
import { ModalCtaButton } from '@/components/ui/Modal/ModalCtaButton';
import { ModalHeader } from '@/components/ui/Modal/ModalHeader';
import { MODAL_PANEL_CLASS } from '@/components/ui/Modal/modalPanel';
import { ApiError } from '@/lib/apiClient';
import { cn } from '@/lib/utils';
import { searchAddresses } from '@/services/addressSearchApi';
import type { AddressSearchItem } from '@/types/addressSearch';

/** 출발/도착 draft — saveStep(3) body와 맞춤 */
export interface AddressDraft {
  zipCode: string;
  address: string;
  detailAddress: string;
}

export type AddressSide = 'departure' | 'arrival';

interface EstimateRequestAddressModalProps {
  side: AddressSide;
  onClose: () => void;
  /** 선택완료 — zip/도로명/상세까지 채운 draft */
  onConfirm: (draft: AddressDraft) => void;
  /** 수정 시 기존 상세 등 초기값 */
  initialDraft?: AddressDraft | null;
}

const SIDE_TITLE: Record<AddressSide, string> = {
  departure: '출발지를 선택해주세요',
  arrival: '도착지를 선택해주세요',
};

/** 수정하기 진입 — draft를 AddressCard용 검색 항목으로 시드 (재검색 없이 상세만 수정 가능) */
const toInitialItem = (draft: AddressDraft | null): AddressSearchItem | null =>
  draft
    ? {
        id: `initial-${draft.zipCode}-${draft.address}`,
        zipCode: draft.zipCode,
        roadAddress: draft.address,
        lotAddress: '',
      }
    : null;

/**
 * Step3 주소 검색 모달 — 행안부 프록시 검색 + AddressCard + 상세주소.
 * 반응형: 기본(모바일) 좁은 패널 → md+ MODAL_PANEL 스펙 (공용 sm:은 이 모달에서 md로 재매핑).
 */
export const EstimateRequestAddressModal = ({
  side,
  onClose,
  onConfirm,
  initialDraft = null,
}: EstimateRequestAddressModalProps) => {
  const titleId = useId();
  const [query, setQuery] = useState('');
  // initialDraft가 있으면 목록·선택 상태를 미리 채워 상세주소·선택완료를 바로 활성화
  const [addresses, setAddresses] = useState<AddressSearchItem[]>(() => {
    const item = toInitialItem(initialDraft);
    return item ? [item] : [];
  });
  const [selectedId, setSelectedId] = useState<string | null>(
    () => toInitialItem(initialDraft)?.id ?? null
  );
  const [detailAddress, setDetailAddress] = useState(
    initialDraft?.detailAddress ?? ''
  );
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selected = addresses.find((item) => item.id === selectedId) ?? null;
  const trimmedDetail = detailAddress.trim();
  const canSubmit =
    selected != null && trimmedDetail.length > 0 && !isSearching;

  const handleSearch = async (keyword: string) => {
    const next = keyword.trim();
    if (!next) {
      setErrorMessage('검색어를 입력해 주세요.');
      setAddresses([]);
      setSelectedId(null);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setErrorMessage(null);
    setSelectedId(null);

    try {
      const result = await searchAddresses({ keyword: next });
      setAddresses(result.addresses);
      setHasSearched(true);
      if (result.addresses.length === 0) {
        setErrorMessage('검색 결과가 없습니다. 다른 검색어를 입력해 주세요.');
      }
    } catch (error) {
      setAddresses([]);
      setHasSearched(true);
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : '주소 검색 중 오류가 발생했습니다.'
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = () => {
    if (!selected || !trimmedDetail) {
      return;
    }

    onConfirm({
      zipCode: selected.zipCode,
      address: selected.roadAddress,
      detailAddress: trimmedDetail,
    });
  };

  return (
    <Modal onClose={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        // 모바일: max-w 18.25rem·패딩/갭. md+: MODAL_PANEL 스펙
        // MODAL_PANEL_CLASS의 sm: 확장을 md로 미룸
        className={cn(
          MODAL_PANEL_CLASS,
          'mx-auto max-w-[18.25rem] gap-[1.875rem] px-4 py-6',
          'sm:max-w-[18.25rem] sm:gap-[1.875rem] sm:rounded-[1.5rem]',
          'md:max-w-[38rem] md:gap-10 md:rounded-[2rem] md:px-6 md:pt-8 md:pb-10'
        )}
      >
        <ModalHeader
          title={SIDE_TITLE[side]}
          onClose={onClose}
          titleId={titleId}
          // 굵기 bold 고정 — 크기만 md에서 확대 (공용 헤더 sm:semibold 덮어씀)
          titleClassName="!text-2lg-bold sm:!text-2lg-bold md:!text-2xl-bold"
          className="[&_button]:sm:!size-6 [&_button]:md:!size-9"
        />

        <div className="flex w-full flex-col gap-4 md:gap-6">
          {/* 모바일 검색(14px) → md+ 검색(20px·h-16) */}
          <TextFieldSearch
            size="sm"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setErrorMessage(null);
            }}
            onClear={() => {
              setQuery('');
              setAddresses([]);
              setSelectedId(null);
              setHasSearched(false);
              setErrorMessage(null);
            }}
            onSearch={() => {
              void handleSearch(query);
            }}
            placeholder="텍스트를 입력해 주세요."
            className={cn(
              '!max-w-none',
              'md:h-16 md:gap-2 md:px-6',
              'md:[&_input]:text-xl-regular',
              'md:[&>svg]:size-9 md:[&_button]:size-9 md:[&>div]:gap-4'
            )}
            aria-label="주소 검색"
            disabled={isSearching}
          />

          {isSearching ? (
            <p
              className="text-md-medium text-gray-400 md:text-lg-medium"
              role="status"
            >
              주소를 검색하는 중…
            </p>
          ) : null}

          {addresses.length > 0 ? (
            <ul className="flex max-h-[16rem] w-full flex-col gap-3 overflow-y-auto md:max-h-[20rem] md:gap-4">
              {addresses.map((address) => (
                <li key={address.id}>
                  <AddressCard
                    zipCode={address.zipCode}
                    roadAddress={address.roadAddress}
                    lotAddress={address.lotAddress}
                    isSelected={selectedId === address.id}
                    // AddressCard 공용 sm: → 이 모달만 md로
                    className={cn(
                      '[&>p]:sm:!text-md-semibold [&>p]:md:!text-lg-semibold',
                      '[&_.min-w-0]:sm:!text-md-regular [&_.min-w-0]:md:!text-lg-regular',
                      '[&_[class*="text-xs-semibold"]]:sm:!min-w-11 [&_[class*="text-xs-semibold"]]:sm:!px-1.5 [&_[class*="text-xs-semibold"]]:sm:!text-xs-semibold',
                      '[&_[class*="text-xs-semibold"]]:md:!min-w-[3.375rem] [&_[class*="text-xs-semibold"]]:md:!px-2 [&_[class*="text-xs-semibold"]]:md:!text-md-semibold'
                    )}
                    onClick={() => {
                      setSelectedId(address.id);
                      setErrorMessage(null);
                    }}
                  />
                </li>
              ))}
            </ul>
          ) : null}

          {hasSearched && !isSearching && addresses.length === 0 ? (
            <p
              className="text-md-medium text-gray-400 md:text-lg-medium"
              role="status"
            >
              검색 결과가 없습니다.
            </p>
          ) : null}

          {/* BE 필수 detailAddress — 선택 후 입력 */}
          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor={`address-detail-${side}`}
              className="text-md-medium text-black-400 md:text-lg-medium"
            >
              상세주소
            </label>
            <TextFieldOutlined
              id={`address-detail-${side}`}
              size="sm"
              className={cn(
                '[&>div]:!w-full',
                'md:[&>div]:!min-h-8 md:[&_input]:text-xl-regular'
              )}
              value={detailAddress}
              onChange={(event) => setDetailAddress(event.target.value)}
              placeholder="상세주소를 입력해 주세요."
              disabled={selected == null}
              aria-required
            />
          </div>

          {errorMessage ? (
            <p
              className="text-md-medium text-red-200 md:text-lg-medium"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}
        </div>

        <ModalCtaButton
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="sm:h-[3.375rem] sm:text-lg-semibold md:h-16 md:text-xl-semibold"
        >
          선택완료
        </ModalCtaButton>
      </section>
    </Modal>
  );
};
