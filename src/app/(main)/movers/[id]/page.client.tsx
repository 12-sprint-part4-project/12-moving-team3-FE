'use client';

import { MoverDetailContentPanel } from './_components/MoverDetailContentPanel';

export interface MoverDetailPageClientProps {
  moverId: string;
}

/** `/movers/[id]` 클라이언트. - 상세 본문 패널 마운트. */
const MoverDetailPageClient = ({ moverId }: MoverDetailPageClientProps) => (
  <MoverDetailContentPanel moverId={moverId} />
);

export default MoverDetailPageClient;
