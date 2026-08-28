import { BaseChip } from './BaseChip';

import type { BaseChipProps } from './BaseChip';

/*
  REGION CHIP

  활동 지역(서울, 경기 등)을 고르거나 표시하는 칩입니다.
  BaseChip을 감싸 textOnly일 때 항상 회색(비활성) 스타일로 고정합니다.
  → Figma: RegionChip 표시용은 Service와 달리 회색 톤 (지역 태그 역할)

  용도
  - button: 프로필 등록 등에서 지역 선택 (isSelected는 부모가 제어, 다중 선택 가능)
  - textOnly: 기사님 상세 등에서 활동 지역 나열 (클릭 불가, 항상 회색)

  [props]
  - variant: 'button' | 'textOnly'
  - isSelected: boolean (button일 때 선택 여부)
  - children: ReactNode
  - className: string
*/

// textOnlyActive는 BaseChip 내부용이라 외부 props에서 제외
type RegionChipProps = Omit<BaseChipProps, 'textOnlyActive'>;

export const RegionChip = (props: RegionChipProps) => {
  // textOnlyActive={false}: textOnly일 때 UNSELECTED(회색) 스타일 고정
  return <BaseChip textOnlyActive={false} {...props} />;
};
