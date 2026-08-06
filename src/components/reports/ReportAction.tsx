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

export interface ReportActionProps {
  target: ReportTarget;
  targetId: string;
  buttonVariant?: ReportButtonVariant;
  className?: string;
}

/**
 * 신고 트리거 + 사유 모달 + API 연동 컨테이너.
 * 비로그인 시 토스트만 띄우고 모달은 열지 않는다.
 */
export const ReportAction = ({
  target,
  targetId,
  buttonVariant = 'default',
  className = '',
}: ReportActionProps) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { submitReport, isPending } = useCreateReport();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => {
    if (!user) {
      showToast({ content: '로그인이 필요한 기능입니다' });
      return;
    }
    setIsModalOpen(true);
  };

  const handleClose = () => {
    if (isPending) return;
    setIsModalOpen(false);
  };

  const handleSubmit = async (category: ReportCategory) => {
    if (isPending) return;

    try {
      await submitReport({ target, targetId, category });
      setIsModalOpen(false);
    } catch {
      // 성공/실패 토스트는 useCreateReport에서 처리
    }
  };

  return (
    <div className={cn(className)}>
      <ReportButton
        onClick={handleOpen}
        disabled={isPending}
        variant={buttonVariant}
      />

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
    </div>
  );
};
