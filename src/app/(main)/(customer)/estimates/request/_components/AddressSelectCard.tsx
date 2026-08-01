import { Button } from '@/components/Button/Button';
import { cn } from '@/lib/utils';

export interface AddressSelectCardProps {
  /** 출발지 선택 CTA 클릭 (스프린트 C에서 모달 오픈) */
  onSelectDeparture?: () => void;
  /** 도착지 선택 CTA 클릭 (스프린트 C에서 모달 오픈) */
  onSelectArrival?: () => void;
  className?: string;
}

/**
 * Step3 출발/도착 선택 카드 — empty 상태 (Figma input/견적요청_주소).
 * ChatPanel 안에서 쓰며, 선택하기 클릭은 상위(AddressStep)에서 모달 연동.
 */
export const AddressSelectCard = ({
  onSelectDeparture,
  onSelectArrival,
  className = '',
}: AddressSelectCardProps) => {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-6 md:gap-[1.3125rem]',
        className
      )}
    >
      {/* 출발지 */}
      <div className="flex w-full flex-col gap-2 md:gap-4">
        <p className="text-md-medium text-black-400 md:text-2lg-medium">
          출발지
        </p>
        <Button
          type="button"
          variant="outlined"
          size="sm"
          className="md:!h-16 md:text-xl-semibold"
          onClick={onSelectDeparture}
        >
          출발지 선택하기
        </Button>
      </div>

      {/* 도착지 */}
      <div className="flex w-full flex-col gap-2 md:gap-4">
        <p className="text-md-medium text-black-400 md:text-2lg-medium">
          도착지
        </p>
        <Button
          type="button"
          variant="outlined"
          size="sm"
          className="md:!h-16 md:text-xl-semibold"
          onClick={onSelectArrival}
        >
          도착지 선택하기
        </Button>
      </div>
    </div>
  );
};
