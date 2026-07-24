interface AddressChipProps {
  label: '도로명' | '지번';
  isSelected: boolean;
}

/**
 * 주소 유형(도로명/지번)을 표시하는 칩. 선택 여부에 따라 배경색만 달라진다.
 * "도로명"/"지번" 글자 수가 달라 너비가 들쭐날쭐해지는 것을 min-width + shrink-0으로 고정해,
 * 옆의 주소 텍스트가 모바일에서 2줄로 줄바꿈되어도(= 시안 요구사항) 칩 크기는 항상 동일하게 유지된다.
 * 모바일(기본값)에서는 폰트/패딩이 작고 배경이 항상 blue-50으로 고정되며,
 * sm 브레이크포인트부터 폰트/패딩이 커지고 선택 시에만 배경이 blue-100으로 바뀐다.
 */
const AddressChip = ({ label, isSelected }: AddressChipProps) => (
  <span
    className={`inline-flex min-w-[2.75rem] shrink-0 items-center justify-center rounded-2xl bg-blue-50 px-[.375rem] py-0.5 text-xs-semibold whitespace-nowrap text-blue-300 sm:min-w-[3.375rem] sm:px-2 sm:text-md-semibold ${
      isSelected ? 'sm:bg-blue-100' : ''
    }`}
  >
    {label}
  </span>
);

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
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={`flex w-full flex-col items-start gap-4 rounded-2xl border px-4 pt-5 pb-6 text-left drop-shadow-[.125rem_.125rem_.3125rem_rgba(224,224,224,0.2)] ${
        isSelected ? 'border-blue-200 bg-blue-50' : 'border-line-100 bg-white'
      } ${className}`}
    >
      <p className="text-md-semibold text-black-400 sm:text-lg-semibold">
        {zipCode}
      </p>
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full items-start gap-2">
          <AddressChip label="도로명" isSelected={isSelected} />
          <p className="min-w-0 flex-1 text-md-regular text-black-400 sm:text-lg-regular">
            {roadAddress}
          </p>
        </div>
        <div className="flex w-full items-start gap-2">
          <AddressChip label="지번" isSelected={isSelected} />
          <p className="min-w-0 flex-1 text-md-regular text-black-400 sm:text-lg-regular">
            {lotAddress}
          </p>
        </div>
      </div>
    </button>
  );
};
