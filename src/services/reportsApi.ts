import { API_BASE_URL } from '@/lib/apiClient';
import { fetchAndValidate } from '@/services/moverApiResponse';
import { assertMoverAccessToken } from '@/services/moversAuth';
import {
  isReportCategory,
  isReportStatus,
  isReportTarget,
  type CreateReportBody,
  type CreateReportResponse,
} from '@/types/report';

const isCreateReportResponse = (
  body: unknown
): body is CreateReportResponse => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const data = (body as { data?: unknown }).data;
  if (!data || typeof data !== 'object') {
    return false;
  }

  const report = data as {
    id?: unknown;
    reporterId?: unknown;
    target?: unknown;
    targetId?: unknown;
    category?: unknown;
    status?: unknown;
    createdAt?: unknown;
  };

  return (
    typeof report.id === 'number' &&
    typeof report.reporterId === 'string' &&
    typeof report.target === 'string' &&
    isReportTarget(report.target) &&
    typeof report.targetId === 'string' &&
    typeof report.category === 'string' &&
    isReportCategory(report.category) &&
    typeof report.status === 'string' &&
    isReportStatus(report.status) &&
    typeof report.createdAt === 'string'
  );
};

/**
 * 신고 등록.
 * POST /api/reports
 */
export const createReport = async (
  body: CreateReportBody
): Promise<CreateReportResponse> => {
  assertMoverAccessToken();

  return fetchAndValidate(
    `${API_BASE_URL}/api/reports`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
    isCreateReportResponse,
    '신고 접수에 실패했습니다.'
  );
};
