/** 배열에서 value가 있으면 제거하고, 없으면 추가한다 */
export const toggleService = <T extends string>(values: T[], value: T): T[] =>
  values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
