import type { ReportCategory } from '@/types/report';

/** 신고 사유 모달 제출 가능 여부 */
export const canSubmitReportCategory = (
  category: ReportCategory | null,
  isSubmitting: boolean
): boolean => !isSubmitting && category !== null;

/** 제출 중이면 모달을 닫지 않는다 */
export const canCloseReportModal = (isSubmitting: boolean): boolean =>
  !isSubmitting;

/** 로그인 사용자만 신고 모달을 연다 */
export const canOpenReportAction = (user: unknown): boolean => Boolean(user);

/** controlled면 controlledOpen, 아니면 내부 open 상태 */
export const resolveReportModalOpen = (
  controlledOpen: boolean | undefined,
  internalOpen: boolean
): boolean =>
  controlledOpen !== undefined ? controlledOpen : internalOpen;
