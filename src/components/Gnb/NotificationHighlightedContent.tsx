import type {
  NotificationItem,
  NotificationType,
} from '@/types/notification';

/** payload에서 강조 문구를 고를 때 우선하는 키 순서 */
const PRIMARY_PAYLOAD_KEYS = [
  'moveTypeLabel',
  'customerName',
  'moverName',
  'authorName',
] as const;

const HIGHLIGHT_CLASS = 'text-blue-300';

/**
 * type + payload로 content 안 강조 구간을 결정한다.
 * 특수 타입은 Figma/BE 템플릿 주석 규칙을 따르고, 나머지는 주요 payload 값 1개를 쓴다.
 */
const getHighlightPhrase = (
  type: NotificationType,
  payload: Record<string, string>,
  content: string
): string | null => {
  switch (type) {
    case 'NEW_QUOTE_OFFER_ARRIVED': {
      const label = payload.moveTypeLabel?.trim();
      return label ? `${label} 견적` : null;
    }
    case 'NEW_DESIGNATED_QUOTE_OFFER_ARRIVED': {
      const label = payload.moveTypeLabel?.trim();
      return label ? `${label} 지정 견적` : null;
    }
    case 'QUOTE_CONFIRMED':
      return '확정';
    case 'CUSTOMER_MOVE_DAY_REMINDER':
    case 'MOVER_MOVE_DAY_REMINDER': {
      const from = payload.departureRegion?.trim();
      const to = payload.arrivalRegion?.trim();
      if (!from || !to) {
        return null;
      }
      return `${from} → ${to} 이사 예정일`;
    }
    default: {
      for (const key of PRIMARY_PAYLOAD_KEYS) {
        const value = payload[key]?.trim();
        if (value && content.includes(value)) {
          return value;
        }
      }

      for (const value of Object.values(payload)) {
        const trimmed = value.trim();
        if (trimmed && content.includes(trimmed)) {
          return trimmed;
        }
      }

      return null;
    }
  }
};

export interface NotificationHighlightedContentProps {
  item: Pick<NotificationItem, 'type' | 'content' | 'payload'>;
}

/** 알림 content에서 강조 구간만 파란 span으로 감싼다. 못 찾으면 plain content. */
export const NotificationHighlightedContent = ({
  item,
}: NotificationHighlightedContentProps) => {
  const { type, content, payload } = item;
  const phrase = getHighlightPhrase(type, payload, content);

  if (!phrase) {
    return content;
  }

  const index = content.indexOf(phrase);
  if (index === -1) {
    return content;
  }

  const before = content.slice(0, index);
  const after = content.slice(index + phrase.length);

  return (
    <>
      {before}
      <span className={HIGHLIGHT_CLASS}>{phrase}</span>
      {after}
    </>
  );
};
