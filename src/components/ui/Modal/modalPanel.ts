/**
 * 모달 콘텐츠 패널(흰 카드) 공통 레이아웃 클래스.
 * 폭 상한은 Modal 셸 래퍼와 동일하게 맞춰, 셸 없이 패널만 렌더할 때도 같은 크기를 유지한다.
 * 기본은 전면 라운드(중앙 배치 시안). 하단 시트는 패널 className으로 덮어쓴다.
 */
export const MODAL_PANEL_CLASS =
  'flex w-full flex-col gap-[1.625rem] rounded-[1.5rem] bg-white px-6 pt-8 pb-10 shadow-[0.25rem_0.25rem_0.3125rem] shadow-shadow-gray-400/20 sm:max-w-[38rem] sm:gap-10 sm:rounded-[2rem]';

/**
 * 모바일 하단 시트용 패널 라운드 (상단만). sm부터는 전면 라운드로 맞춘다.
 * MoveTypeFilterModal 등 placement="bottom" 콘텐츠에 함께 쓴다.
 */
export const MODAL_PANEL_BOTTOM_SHEET_CLASS =
  'rounded-t-[2rem] rounded-b-none sm:rounded-[2rem]';

/**
 * MoveTypeChip size="sm" 위에 얹어 sm:부터 Figma md 스펙으로 키운다.
 * (size prop은 반응형이 아니라서, 칩을 두 번 그리는 대신 className으로 처리)
 */
export const MOVE_TYPE_CHIP_RESPONSIVE_CLASS =
  'sm:gap-1 sm:py-1 sm:pr-1.25 sm:text-lg-semibold [&_svg]:sm:size-6';
