/** searchParams 값을 단일 문자열로 정규화 */
export const resolveTabSearchParam = (
  value: string | string[] | undefined
): string | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value ?? null;
};
