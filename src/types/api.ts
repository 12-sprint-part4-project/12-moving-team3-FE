/** API 공통 에러 본문 */
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}

/** API 성공 응답 래퍼 */
export interface ApiSuccessResponse<TData, TMeta = undefined> {
  data: TData;
  meta?: TMeta;
}
