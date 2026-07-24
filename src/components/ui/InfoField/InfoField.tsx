export type InfoFieldColor = 'blue' | 'red' | 'neutral';

export interface InfoFieldProps {
  /** dt(라벨 pill)에 들어갈 내용 (예: '이사일', '도로명') */
  label: React.ReactNode;
  /** dd(값)에 들어갈 내용 (예: '2024. 07. 01(월)', '210,000원') */
  value: React.ReactNode;
  /** 라벨 pill 배경/글자 색상 프리셋 */
  color?: InfoFieldColor;
  /** dl(전체 묶음: 라벨+값)에 줄 클래스. 둘 사이 정렬/간격 등. */
  className?: string;
  /** dt(라벨 pill)에 줄 클래스. 크기/패딩/너비 등 사용처마다 달라지는 값. */
  labelClassName?: string;
  /** dd(값)에 줄 클래스. */
  valueClassName?: string;
}

const colorStyle: Record<InfoFieldColor, string> = {
  blue: 'bg-blue-50 text-blue-300',
  red: 'bg-red-100 text-red-200',
  neutral: 'bg-background-400 text-gray-500',
};

/**
 * "라벨 pill + 값" 한 쌍을 표시하는 공통 UI.
 * (예: 이사일 2024.07.01 / 출발 서울시 중구 / 견적가 210,000원)
 * dl > dt(라벨 pill) + dd(값)로 구성해 라벨-값 관계를 시맨틱하게 표현한다.
 * color(배경/글자 색상 프리셋)를 제외한 크기/패딩/폰트 등은 기본값을 두지 않고
 * labelClassName/valueClassName으로 사용처마다 직접 지정한다 — 같은 클래스를
 * 컴포넌트 내부 기본값과 호출 측 className에 동시에 넣으면 Tailwind 클래스
 * 우선순위 충돌로 호출 측 스타일이 무시될 수 있기 때문이다.
 */
export const InfoField = ({
  label,
  value,
  color = 'neutral',
  className = '',
  labelClassName = '',
  valueClassName = '',
}: InfoFieldProps) => (
  <dl className={`inline-flex items-center gap-3 ${className}`}>
    <dt
      className={`inline-flex items-center justify-center rounded-sm whitespace-nowrap ${colorStyle[color]} ${labelClassName}`}
    >
      {label}
    </dt>
    <dd className={valueClassName}>{value}</dd>
  </dl>
);
