'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/Button/Button';
import { TextFieldChat } from '@/components/ui/Input/TextFieldChat';

import { EstimateRequestChatBubbleGroup } from './EstimateRequestChatBubbleGroup';
import { EstimateRequestChatPanel } from './EstimateRequestChatPanel';

export type EstimateRequestGateKind = 'unauthorized' | 'profileIncomplete';

interface GateConfig {
  message: string;
  actionLabel: string;
  actionHref: string;
  /** section 접근성 라벨 */
  ariaLabel: string;
}

const GATE_CONFIG: Record<EstimateRequestGateKind, GateConfig> = {
  unauthorized: {
    message: '견적 요청은 로그인 후 이용할 수 있습니다.',
    actionLabel: '로그인 하러 가기',
    actionHref: '/login',
    ariaLabel: '로그인 안내',
  },
  profileIncomplete: {
    message: '견적 요청을 하려면 프로필 등록이 필요합니다.',
    actionLabel: '프로필 등록하러 가기',
    actionHref: '/profile/customer',
    ariaLabel: '프로필 등록 안내',
  },
};

interface EstimateRequestGateProps {
  kind: EstimateRequestGateKind;
}

/**
 * 비회원·프로필 미등록 게이트 — Shell 안 채팅형 안내 레이아웃.
 * 텍스트는 TextFieldChat, CTA는 ChatPanel 흰 바탕에 배치.
 */
export const EstimateRequestGate = ({ kind }: EstimateRequestGateProps) => {
  const router = useRouter();
  const { message, actionLabel, actionHref, ariaLabel } = GATE_CONFIG[kind];

  return (
    <section
      aria-label={ariaLabel}
      className="page-content flex flex-col gap-2 md:gap-6"
    >
      <EstimateRequestChatBubbleGroup>
        <TextFieldChat role="status">{message}</TextFieldChat>
      </EstimateRequestChatBubbleGroup>

      <EstimateRequestChatPanel>
        <Button
          type="button"
          variant="solid"
          size="sm"
          className="md:h-16 md:text-xl-semibold"
          onClick={() => {
            router.push(actionHref);
          }}
        >
          {actionLabel}
        </Button>
      </EstimateRequestChatPanel>
    </section>
  );
};
