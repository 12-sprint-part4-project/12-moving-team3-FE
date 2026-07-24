interface TriggerWidthSizerOption {
  label: string;
  value: string;
}

interface TriggerWidthSizerProps {
  options: TriggerWidthSizerOption[];
  triggerClassName: string;
  iconClassName: string;
}

/**
 * 트리거 너비를 옵션 중 가장 긴 label 기준으로 맞추기 위한 숨김 sizer.
 * inline-grid 레이아웃의 같은 셀에 실제 트리거와 겹쳐 사용
 */
export const TriggerWidthSizer = ({
  options,
  triggerClassName,
  iconClassName,
}: TriggerWidthSizerProps) => {
  return (
    <div
      aria-hidden
      className="invisible col-start-1 row-start-1 flex h-0 flex-col overflow-hidden whitespace-nowrap"
    >
      {options.map((option) => (
        <span
          key={option.value}
          className={`inline-flex items-center ${triggerClassName}`}
        >
          {option.label}
          <span className={`shrink-0 ${iconClassName}`} />
        </span>
      ))}
    </div>
  );
};
