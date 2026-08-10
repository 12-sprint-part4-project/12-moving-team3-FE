'use client';

import { useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';

import { Modal, ModalBasic, ModalCtaButton } from '@/components/ui/Modal';
import { getCroppedImage } from '@/lib/getCroppedImage';
import { cn } from '@/lib/utils';

interface ProfileImageCropModalProps {
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (blob: Blob) => void;
}

export const ProfileImageCropModal = ({
  imageSrc,
  onClose,
  onCropComplete,
}: ProfileImageCropModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleCropComplete = (
    _croppedArea: Area,
    croppedAreaPixelsValue: Area
  ) => {
    setCroppedAreaPixels(croppedAreaPixelsValue);
  };

  const handleConfirm = async () => {
    if (!croppedAreaPixels || isPending) return;

    setIsPending(true);
    try {
      const blob = await getCroppedImage(imageSrc, croppedAreaPixels);
      onCropComplete(blob);
    } catch {
      setIsPending(false);
    }
  };

  return (
    <Modal onClose={onClose} closeOnDimmedClick={false}>
      <ModalBasic
        title="프로필 이미지 편집"
        onClose={onClose}
        footer={
          <ModalCtaButton
            onClick={() => {
              void handleConfirm();
            }}
            disabled={!croppedAreaPixels || isPending}
          >
            {isPending ? '적용 중...' : '적용하기'}
          </ModalCtaButton>
        }
      >
        <div className="flex w-full flex-col gap-6">
          <div className="relative h-[18.75rem] w-full overflow-hidden rounded-2xl bg-black-500 sm:h-[22.5rem]">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
              showGrid={false}
            />
          </div>

          <label className="flex w-full flex-col gap-2">
            <span className="text-md-medium text-black-300">확대/축소</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className={cn(
                'h-2 w-full cursor-pointer appearance-none rounded-full bg-line-200',
                'accent-blue-300'
              )}
              aria-label="이미지 확대/축소"
            />
          </label>
        </div>
      </ModalBasic>
    </Modal>
  );
};
