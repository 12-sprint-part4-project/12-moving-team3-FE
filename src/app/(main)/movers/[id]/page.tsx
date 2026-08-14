import { getMoverDetail } from '@/services/moversApi';

import MoverDetailPageClient from './page.client';

import type { Metadata } from 'next';

export interface MoverDetailPageProps {
  params: Promise<{ id: string }>;
}

/** 기사님 이름 기반 탭 타이틀 — 루트 template으로 `{name} 기사님 | 무빙` */
export async function generateMetadata({
  params,
}: MoverDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await getMoverDetail(id);
    const name = res.data.moverDetail.user.name?.trim();
    if (name) {
      return { title: `${name} 기사님` };
    }
  } catch {
    // 404·네트워크 등 → fallback
  }
  return { title: '기사님 상세' };
}

/** `/movers/[id]` 서버 페이지. - route id를 Client에 넘긴다. */
const MoverDetailPage = async ({ params }: MoverDetailPageProps) => {
  const { id } = await params;

  return <MoverDetailPageClient moverId={id} />;
};

export default MoverDetailPage;
