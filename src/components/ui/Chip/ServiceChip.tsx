import { BaseChip } from './BaseChip';

import type { BaseChipProps } from './BaseChip';

/*
  SERVICE CHIP

  제공 서비스(소형이사, 가정이사 등)를 고르거나 표시하는 칩입니다.
  BaseChip을 감싸 textOnly일 때 항상 파란(활성) 스타일로 고정합니다.
  → Figma: ServiceChip은 표시용일 때도 선택된 서비스처럼 파란 톤을 유지

  용도
  - button: 프로필 등록 등에서 서비스 선택 (isSelected는 부모가 제어, 다중 선택 가능)
  - textOnly: 기사님 상세 등에서 제공 서비스 나열 (클릭 불가, 항상 파란)

  [props]
  - variant: 'button' | 'textOnly'
  - isSelected: boolean (button일 때 선택 여부)
  - children: ReactNode
  - className: string
*/

// textOnlyActive는 BaseChip 내부용이라 외부 props에서 제외
type ServiceChipProps = Omit<BaseChipProps, 'textOnlyActive'>;

export const ServiceChip = (props: ServiceChipProps) => {
  // textOnlyActive={true}: textOnly일 때 SELECTED(파란) 스타일 고정
  return <BaseChip textOnlyActive {...props} />;
};
