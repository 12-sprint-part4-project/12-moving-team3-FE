'use client';

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type RefObject,
} from 'react';

interface UseProfileImageCropResult {
  imageInputRef: RefObject<HTMLInputElement | null>;
  previewUrl: string | null;
  cropImageSrc: string | null;
  profileImageFile: File | null;
  handleImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleImageButtonClick: () => void;
  handleCropClose: () => void;
  handleCropComplete: (blob: Blob) => void;
}

/** 프로필 이미지 선택·크롭·미리보기 object URL 정리 */
export const useProfileImageCrop = (): UseProfileImageCropResult => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (cropImageSrc) URL.revokeObjectURL(cropImageSrc);
    };
  }, [cropImageSrc]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setCropImageSrc(URL.createObjectURL(file));
  };

  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };

  const handleCropClose = () => {
    setCropImageSrc(null);
  };

  const handleCropComplete = (blob: Blob) => {
    const file = new File([blob], 'profile.jpg', {
      type: blob.type || 'image/jpeg',
    });
    setProfileImageFile(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(blob);
    });
    setCropImageSrc(null);
  };

  return {
    imageInputRef,
    previewUrl,
    cropImageSrc,
    profileImageFile,
    handleImageChange,
    handleImageButtonClick,
    handleCropClose,
    handleCropComplete,
  };
};
