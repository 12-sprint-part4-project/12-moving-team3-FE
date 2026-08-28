import type { DropdownOption } from '@/constants/dropdownOptions';

interface TriggerWidthSizerProps {
  options: DropdownOption[];
  triggerClassName: string;
  iconClassName: string;
}

/**
 * 트리거 너비를 옵션 중 가장 긴 label 기준으로 맞추기 위한 숨김 sizer.
 */
export const TriggerWidthSizer = ({
  options,
  triggerClassName,
  iconClassName,
}: TriggerWidthSizerProps) => {
  return (
    <div
      aria-hidden
      className="invisible col-start-1 row-start-1 flex h-0 min-h-0 flex-col overflow-hidden whitespace-nowrap"
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
