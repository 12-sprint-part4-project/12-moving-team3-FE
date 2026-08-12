'use client';

import { useState } from 'react';

import {
  ReportButton,
  type ReportButtonVariant,
} from '@/components/reports/ReportButton';
import { ReportCategoryModal } from '@/components/reports/ReportCategoryModal';
import { Modal } from '@/components/ui/Modal/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useCreateReport } from '@/hooks/useCreateReport';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';
import type { ReportCategory, ReportTarget } from '@/types/report';

interface ReportActionBaseProps {
  target: ReportTarget;
  targetId: string;
  buttonVariant?: ReportButtonVariant;
  className?: string;
}

interface UncontrolledReportActionProps extends ReportActionBaseProps {
  controlledOpen?: never;
  onControlledClose?: never;
}

/**
 * controlled 모드 — 트리거 버튼을 렌더하지 않고 모달 open/close를 외부에서 제어한다.
 * (드롭다운 안에서 사용 시 부모 조건부 렌더와 충돌을 피하기 위해 사용)
 */
interface ControlledReportActionProps extends ReportActionBaseProps {
  controlledOpen: boolean;
  onControlledClose: () => void;
}

export type ReportActionProps = UncontrolledReportActionProps | ControlledReportActionProps;

/**
 * 신고 트리거 + 사유 모달 + API 연동 컨테이너.
 * 비로그인 시 토스트만 띄우고 모달은 열지 않는다.
 *
 * - 기본(uncontrolled): 내부 버튼으로 모달을 열고 닫음
 * - controlled: `controlledOpen` + `onControlledClose` 제공 시 모달만 렌더
 */
export const ReportAction = ({
  target,
  targetId,
  buttonVariant = 'default',
  className = '',
  controlledOpen,
  onControlledClose,
}: ReportActionProps) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { submitReport, isPending } = useCreateReport();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isModalOpen = isControlled ? controlledOpen : internalOpen;

  const handleOpen = () => {
    if (!user) {
      showToast({ content: '로그인이 필요한 기능입니다' });
      return;
    }
    setInternalOpen(true);
  };

  const handleClose = () => {
    if (isPending) return;
    if (isControlled) {
      onControlledClose?.();
    } else {
      setInternalOpen(false);
    }
  };

  const handleSubmit = async (category: ReportCategory) => {
    if (isPending) return;

    try {
      await submitReport({ target, targetId, category });
      handleClose();
    } catch {
      // 성공/실패 토스트는 useCreateReport에서 처리
    }
  };

  return (
    <>
      {!isControlled ? (
        <div className={cn(className)}>
          <ReportButton
            onClick={handleOpen}
            disabled={isPending}
            variant={buttonVariant}
          />
        </div>
      ) : null}

      {isModalOpen ? (
        <Modal placement="bottom" onClose={handleClose}>
          <ReportCategoryModal
            onClose={handleClose}
            onSubmit={(category) => {
              void handleSubmit(category);
            }}
            isSubmitting={isPending}
          />
        </Modal>
      ) : null}
    </>
  );
};
