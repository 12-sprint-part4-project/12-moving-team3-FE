import type { BaseChipProps } from './BaseChip';
import { BaseChip } from './BaseChip';

/*
  REGION CHIP

  두 용도로 구분됩니다.
  button으로 사용하기 : 프로필 등록 등..
  textOnly으로 사용하기 : 기사님 상세 페이지 등..

  [props]
  - variant: 'button' | 'textOnly'
  - isSelected: boolean (button일 때 선택 여부)
  - children: ReactNode
  - className: string
*/

type RegionChipProps = Omit<BaseChipProps, 'textOnlyActive'>;

export const RegionChip = (props: RegionChipProps) => {
  return <BaseChip textOnlyActive={false} {...props} />;
};
