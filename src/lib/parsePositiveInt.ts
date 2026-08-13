/** 양의 정수로 변환. 아니면 null */
export const parsePositiveInt = (
  value: string | null | undefined
): number | null => {
  if (value == null || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
};
