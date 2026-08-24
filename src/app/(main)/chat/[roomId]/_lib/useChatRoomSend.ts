'use client';

import { useState } from 'react';

import { useSendChatMessage } from '@/hooks/useChat';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/i18n/useTranslation';
import { ApiError } from '@/lib/apiClient';
import { uploadChatImage } from '@/lib/uploadChatImage';

interface UseChatRoomSendParams {
  roomId: number;
  isMessagingAllowed: boolean;
  onMessageSent: () => void;
}

/** 채팅방 텍스트·이미지 전송 */
export const useChatRoomSend = ({
  roomId,
  isMessagingAllowed,
  onMessageSent,
}: UseChatRoomSendParams) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const sendMutation = useSendChatMessage(roomId);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const handleSend = async (content: string) => {
    if (!isMessagingAllowed) {
      return;
    }

    try {
      await sendMutation.mutateAsync({
        messageType: 'TEXT',
        content,
      });
      onMessageSent();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : t('chat.sendFail');
      showToast({ content: message });
      throw error;
    }
  };

  const handleSendImages = async (files: File[]) => {
    if (!isMessagingAllowed || files.length === 0) {
      return;
    }

    setIsUploadingImages(true);
    try {
      const attachments = await Promise.all(files.map(uploadChatImage));
      await sendMutation.mutateAsync({
        messageType: 'IMAGE',
        attachments,
      });
      onMessageSent();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : t('chat.imageSendFail');
      showToast({ content: message });
      throw error;
    } finally {
      setIsUploadingImages(false);
    }
  };

  const isSending = sendMutation.isPending || isUploadingImages;

  return {
    handleSend,
    handleSendImages,
    isSending,
  };
};
