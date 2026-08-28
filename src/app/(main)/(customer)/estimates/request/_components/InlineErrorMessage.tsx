interface InlineErrorMessageProps {
  message: string | null;
}

/** 견적요청 스텝 공통 인라인 에러 알림 */
export const InlineErrorMessage = ({ message }: InlineErrorMessageProps) =>
  message ? (
    <p className="text-md-medium text-red-200" role="alert">
      {message}
    </p>
  ) : null;
