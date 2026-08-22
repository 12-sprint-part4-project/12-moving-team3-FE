'use client';

import { InfoField } from '@/components/ui/InfoField/InfoField';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

/**
 * 주소 유형(도로명/지번) 라벨 pill의 크기/너비.
 * "도로명"/"지번" 글자 수가 달라 너비가 들쭐날쭐해지는 것을 min-width + shrink-0으로 고정해,
 * 옆의 주소 텍스트가 모바일에서 2줄로 줄바꿈되어도(= 시안 요구사항) 라벨 pill 크기는 항상 동일하게 유지된다.
 * 모바일(기본값)에서는 폰트/패딩이 작고, sm 브레이크포인트부터 폰트/패딩이 커진다.
 */
const ADDRESS_LABEL_STYLE =
  'min-w-11 shrink-0 px-1.5 py-0.5 text-xs-semibold rounded-2xl sm:min-w-[3.375rem] sm:px-2 sm:text-md-semibold';

export interface AddressCardProps {
  /** 우편번호 */
  zipCode: string;
  /** 도로명 주소 */
  roadAddress: string;
  /** 지번 주소 */
  lotAddress: string;
  /** 선택된 카드인지 여부 */
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

/** 주소 검색 결과 등에서 사용하는 선택형 주소 카드 공통 컴포넌트 */
export const AddressCard = ({
  zipCode,
  roadAddress,
  lotAddress,
  isSelected = false,
  onClick,
  className = '',
}: AddressCardProps) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={cn(
        'flex w-full flex-col items-start gap-4 rounded-2xl border px-4 pt-5 pb-6 text-left shadow-[.125rem_.125rem_.3125rem] shadow-shadow-gray-200/20',
        isSelected ? 'border-blue-200 bg-blue-50' : 'border-line-100 bg-white',
        className
      )}
    >
      <p className="text-md-semibold text-black-400 sm:text-lg-semibold">
        {zipCode}
      </p>
      <div className="flex w-full flex-col gap-4">
        <InfoField
          label={t('estimateRequest.roadAddressLabel')}
          value={roadAddress}
          color="blue"
          className="w-full items-start gap-2"
          labelClassName={`${ADDRESS_LABEL_STYLE} ${isSelected ? 'sm:bg-blue-100' : ''}`}
          valueClassName="min-w-0 flex-1 text-md-regular text-black-400 sm:text-lg-regular"
        />
        <InfoField
          label={t('estimateRequest.lotAddressLabel')}
          value={lotAddress}
          color="blue"
          className="w-full items-start gap-2"
          labelClassName={`${ADDRESS_LABEL_STYLE} ${isSelected ? 'sm:bg-blue-100' : ''}`}
          valueClassName="min-w-0 flex-1 text-md-regular text-black-400 sm:text-lg-regular"
        />
      </div>
    </button>
  );
};
