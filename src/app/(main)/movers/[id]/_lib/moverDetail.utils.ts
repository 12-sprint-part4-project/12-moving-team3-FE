import { API_ERROR_CODE } from '@/constants/errorCode';
import { ApiError } from '@/lib/apiClient';

/** GET /api/movers/:id 404·MOVER_NOT_FOUND 여부 */
export const isMoverDetailNotFound = (
  isError: boolean,
  error: unknown
): boolean =>
  isError &&
  error instanceof ApiError &&
  (error.status === 404 || error.code === API_ERROR_CODE.MOVER_NOT_FOUND);

/** MOVER가 아닌 사용자에게만 지정 견적 CTA 노출 */
export const resolveShowDesignatedCta = (
  userType: string | undefined
): boolean => userType !== 'MOVER';

/** 지정 견적 완료 후 채팅 CTA 노출 조건 */
export const resolveShowChatCta = (input: {
  showDesignatedCta: boolean;
  isAlreadyDesignated: boolean;
  designatedMoverId: string | number | null | undefined;
  estimateRequestId: string | number | null | undefined;
}): boolean =>
  input.showDesignatedCta &&
  input.isAlreadyDesignated &&
  input.designatedMoverId != null &&
  input.estimateRequestId != null;

/** 지정 견적 버튼 disabled·soft-block 상태 */
export const resolveDesignatedButtonState = (designated: {
  isPending: boolean;
  isAlreadyDesignated: boolean;
  isStatusLoading: boolean;
  isRequestFailed: boolean;
  hasReceivedQuoteFromMover: boolean;
  isQuoteStatusError: boolean;
}): { isHardDisabled: boolean; isSoftBlocked: boolean } => {
  const isHardDisabled =
    designated.isPending ||
    designated.isAlreadyDesignated ||
    designated.isStatusLoading ||
    designated.isRequestFailed;
  const isSoftBlocked =
    (designated.hasReceivedQuoteFromMover || designated.isQuoteStatusError) &&
    !isHardDisabled;

  return { isHardDisabled, isSoftBlocked };
};
