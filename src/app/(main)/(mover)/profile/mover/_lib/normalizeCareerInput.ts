/** 경력 입력에서 숫자만 남기고 선행 0을 제거한다 */
export const normalizeCareerInput = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits === '') return '';
  return String(Number(digits));
};
