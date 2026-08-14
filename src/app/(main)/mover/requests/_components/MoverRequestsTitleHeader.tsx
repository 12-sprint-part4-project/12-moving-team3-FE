import { cn } from '@/lib/utils';

export interface MoverRequestsTitleHeaderProps {
  title: string;
  paddingClassName: string;
  className?: string;
}

/** `/mover/requests` 타이틀 헤더. */
export const MoverRequestsTitleHeader = ({
  title,
  paddingClassName,
  className = '',
}: MoverRequestsTitleHeaderProps) => (
  <div
    className={cn(
      'border-b border-line-100 bg-white py-4 shadow-page-title md:py-6 lg:py-8',
      paddingClassName,
      className
    )}
  >
    <h1 className="text-2lg-semibold text-black-400 lg:text-2xl-semibold">
      {title}
    </h1>
  </div>
);
