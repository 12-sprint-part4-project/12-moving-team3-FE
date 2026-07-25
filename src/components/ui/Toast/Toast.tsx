import type { ReactNode } from 'react';

export interface ToastProps {
  /** 토스트 앞에 보여줄 아이콘 (선택) */
  icon?: ReactNode;
  /** 토스트에 표시할 내용 (필수) */
  content: ReactNode;
  className?: string;
}

/**
 * 전역 어디서든 띄울 수 있는 토스트 UI(프레젠테이션 컴포넌트).
 * 실제 화면에 등장/사라짐을 제어하는 큐잉·타이머 로직은 `ToastProvider`가 담당하고,
 * 이 컴포넌트는 "아이콘 + 내용 한 줄"을 보여주는 순수 UI만 책임진다.
 *
 * Figma 시안은 sm/md/lg 3개 크기 배리언트로 나뉘어 있지만, 콘텐츠 구조와 색상은 동일하고
 * 크기(폰트/패딩/모서리 곡률)만 다르므로, 별도의 size prop 없이 모바일 퍼스트 반응형
 * 클래스(기본=sm, sm:=md, md:=lg)로 하나의 마크업 안에서 표현한다.
 */
export const Toast = ({ icon, content, className = '' }: ToastProps) => (
  <div
    role="status"
    aria-live="polite"
    className={`flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-3 py-2.5 text-sm-semibold text-blue-300 sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-4 sm:text-lg-semibold md:py-5 ${className}`}
  >
    {icon && (
      <span className="shrink-0 [&_svg]:size-4 sm:[&_svg]:size-6">
        {icon}
      </span>
    )}
    <p className="min-w-0">{content}</p>
  </div>
);
