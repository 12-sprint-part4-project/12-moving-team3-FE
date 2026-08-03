/** 이용 서비스 칩 다중 선택 토글 */
export const toggleService = <T extends string>(
  values: T[],
  value: T
): T[] =>
  values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
