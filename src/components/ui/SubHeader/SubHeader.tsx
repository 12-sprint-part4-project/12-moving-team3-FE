import RouteArrowIcon from '@/assets/icons/route-arrow.svg';

export type SubHeaderSize = 'sm' | 'md' | 'lg';

export interface SubHeaderProps {
  /**
   * 반응형 사이즈.
   * - sm: Mobile
   * - md: Tablet
   * - lg: PC
   */
  size?: SubHeaderSize;
  /** 이사 유형 (예: 소형이사) */
  moveType: string;
  /** 견적 신청일 표시 문자열 (예: 2024년 6월 24일) */
  requestedAt: string;
  /** 출발지 */
  from: string;
  /** 도착지 */
  to: string;
  /** 이사일 표시 문자열 (예: 2024년 07월 01일 (월)) */
  moveDate: string;
  className?: string;
}

const ROOT_STYLE: Record<SubHeaderSize, string> = {
  sm: 'px-6 py-5',
  md: 'px-[4.5rem] py-8',
  lg: 'px-[16.25rem] py-8',
};

interface DetailColumnProps {
  label: string;
  value: string;
}

const DetailColumn = ({ label, value }: DetailColumnProps) => (
  <div className="flex shrink-0 flex-col items-start">
    <p className="text-lg-medium whitespace-nowrap text-gray-300">{label}</p>
    <p className="text-2lg-semibold whitespace-nowrap text-black-300">{value}</p>
  </div>
);

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow = ({ label, value }: DetailRowProps) => (
  <div className="flex w-full items-center justify-between">
    <p className="text-md-regular whitespace-nowrap text-gray-300">{label}</p>
    <p className="text-md-semibold whitespace-nowrap text-black-300">{value}</p>
  </div>
);

/**
 * 요청 견적 서브 헤더.
 * Figma "Sub header/요청견적" — size=PC | Tablet | Mobile.
 */
export const SubHeader = ({
  size = 'lg',
  moveType,
  requestedAt,
  from,
  to,
  moveDate,
  className = '',
}: SubHeaderProps) => {
  const isMobile = size === 'sm';
  const isTablet = size === 'md';

  return (
    <section
      className={`flex w-full flex-col items-start bg-white shadow-[0_0.5rem_0.625rem_0_rgb(39_39_75/0.02)] ${ROOT_STYLE[size]} ${className}`}
    >
      <div
        className={`flex w-full ${
          isMobile
            ? 'flex-col items-start justify-end gap-5'
            : isTablet
              ? 'flex-col items-start justify-end gap-7'
              : 'items-end gap-5'
        }`}
      >
        <div
          className={`flex flex-col items-start ${
            isMobile
              ? 'w-full'
              : isTablet
                ? 'w-full gap-1'
                : 'min-w-0 flex-1 gap-1'
          }`}
        >
          <h2
            className={`whitespace-nowrap ${
              isMobile
                ? 'text-2lg-semibold text-black-400'
                : 'text-2xl-semibold text-black-300'
            }`}
          >
            {moveType}
          </h2>
          <p
            className={`whitespace-nowrap ${
              isMobile
                ? 'text-xs-regular text-gray-500'
                : 'text-lg-medium text-gray-300'
            }`}
          >
            견적 신청일: {requestedAt}
          </p>
        </div>

        {isMobile ? (
          <div className="flex w-full flex-col items-start gap-1">
            <DetailRow label="출발지" value={from} />
            <DetailRow label="도착지" value={to} />
            <DetailRow label="이사일" value={moveDate} />
          </div>
        ) : (
          <div
            className={`flex shrink-0 items-start ${
              isTablet ? 'w-full gap-10' : 'gap-10'
            }`}
          >
            <div className="flex shrink-0 items-end gap-3">
              <DetailColumn label="출발지" value={from} />
              <RouteArrowIcon
                className="mb-[0.1875rem] h-[1.4375rem] w-[0.53125rem] shrink-0"
                aria-hidden
              />
              <DetailColumn label="도착지" value={to} />
            </div>
            <DetailColumn label="이사일" value={moveDate} />
          </div>
        )}
      </div>
    </section>
  );
};
