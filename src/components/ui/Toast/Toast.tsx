import type { FC, ReactNode, SVGProps } from 'react';

/** SVGR로 import한 svg 아이콘 컴포넌트 타입 (`src/types/svg.d.ts` 선언과 동일한 형태) */
export type ToastIconComponent = FC<SVGProps<SVGSVGElement>>;

/** icon 없이 별도 지정하지 않았을 때 적용되는 기본값: 16x16(size-4) + sm:24x24(size-6) + currentColor 상속(fill-current) */
const DEFAULT_ICON_CLASSNAME =
  'size-4 shrink-0 sm:size-6 text-blue-300 fill-current';

export interface ToastProps {
  /**
   * 토스트 앞에 보여줄 아이콘 (선택).
   * 이미 렌더링된 JSX가 아니라 `import Icon from '@/assets/icons/xxx.svg'`로 가져온
   * svg 컴포넌트 자체를 넘긴다.
   */
  icon?: ToastIconComponent;
  /**
   * 아이콘에 적용할 className (선택). 기본값은 24x24(`size-6`) + 텍스트 색을 그대로
   * 따라가는 `fill-current`다. 아이콘만 다른 크기/색으로 쓰고 싶은 화면에서는 이 prop으로
   * 기본값을 완전히 대체해서 지정한다 — `InfoField`와 동일하게, 컴포넌트 기본값과
   * 호출 측 className을 같은 속성에 동시에 넣으면 Tailwind 우선순위 충돌이 날 수 있어
   * 섞지 않고 통째로 교체하는 방식을 쓴다.
   */
  iconClassName?: string;
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
export const Toast = ({
  icon: Icon,
  iconClassName = DEFAULT_ICON_CLASSNAME,
  content,
  className = '',
}: ToastProps) => (
  <div
    role="status"
    aria-live="polite"
    className={`flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-100 px-6 py-2.5 text-sm-semibold text-blue-300 sm:gap-4 sm:py-4.5 sm:text-lg-semibold md:px-8 md:py-6 ${className}`}
  >
    {Icon && <Icon className={iconClassName} />}
    <p className="min-w-0">{content}</p>
  </div>
);
