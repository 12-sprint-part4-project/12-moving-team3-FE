import Link from 'next/link';

interface EstimateRequestStatusMessageProps {
  message: string;
  role?: 'alert' | 'status';
  linkHref?: string;
  linkLabel?: string;
  /** 링크 대신 버튼 액션이 필요할 때 (예: 다시 시도) */
  onActionClick?: () => void;
  detailText?: string;
}

/**
 * bootstrap 비정상 상태(unauthorized/blocked/error 등) 공통 안내 UI.
 * 제목·메시지·선택 상세·링크/버튼 레이아웃을 한곳에서 관리한다.
 */
export const EstimateRequestStatusMessage = ({
  message,
  role,
  linkHref,
  linkLabel,
  onActionClick,
  detailText,
}: EstimateRequestStatusMessageProps) => {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-8 sm:px-18">
      <h1 className="text-black-400 text-2lg-bold">견적 요청</h1>
      <p className="text-gray-500 text-lg-medium" role={role}>
        {message}
      </p>
      {detailText ? (
        <p className="text-md-regular text-gray-400">{detailText}</p>
      ) : null}
      {linkHref && linkLabel ? (
        <Link
          href={linkHref}
          className="text-blue-300 text-lg-semibold w-fit underline"
        >
          {linkLabel}
        </Link>
      ) : null}
      {onActionClick && linkLabel && !linkHref ? (
        <button
          type="button"
          onClick={onActionClick}
          className="text-blue-300 text-lg-semibold w-fit underline"
        >
          {linkLabel}
        </button>
      ) : null}
    </div>
  );
};
