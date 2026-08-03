import type { ApiSuccessResponse } from '@/types/api';

/** 신고 대상 타입 (BE UserReportTarget) */
export const REPORT_TARGETS = [
  'USER',
  'REVIEW',
  'CHAT_ROOM',
  'MESSAGE',
  'ARTICLE',
  'COMMENT',
] as const;
export type ReportTarget = (typeof REPORT_TARGETS)[number];

/** 신고 사유 카테고리 (BE UserReportCategory) */
export const REPORT_CATEGORIES = [
  'INAPPROPRIATE_PROFILE',
  'ABUSIVE_LANGUAGE',
] as const;
export type ReportCategory = (typeof REPORT_CATEGORIES)[number];

/** 신고 처리 상태 */
export const REPORT_STATUSES = ['PENDING', 'RESOLVED', 'REJECTED'] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

/** POST /api/reports Body */
export interface CreateReportBody {
  target: ReportTarget;
  /** USER: UUID / 그 외: 양의 정수 문자열 */
  targetId: string;
  category: ReportCategory;
}

/** POST /api/reports 성공 시 data */
export interface ReportDetail {
  id: number;
  reporterId: string;
  target: ReportTarget;
  targetId: string;
  category: ReportCategory;
  status: ReportStatus;
  createdAt: string;
}

export type CreateReportResponse = ApiSuccessResponse<ReportDetail>;

/** 신고 사유 선택 UI용 옵션 */
export interface ReportCategoryOption {
  value: ReportCategory;
  label: string;
}

/** 신고 사유 선택 UI용 라벨 */
export const REPORT_CATEGORY_OPTIONS: ReportCategoryOption[] = [
  { value: 'INAPPROPRIATE_PROFILE', label: '부적절한 프로필' },
  { value: 'ABUSIVE_LANGUAGE', label: '욕설 / 비방' },
];
