'use client';

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type RefObject,
} from 'react';

interface UseProfileImageCropOptions {
  /** 수정 폼에서 기존 프로필 이미지 URL */
  initialImageUrl?: string | null;
}

interface UseProfileImageCropResult {
  imageInputRef: RefObject<HTMLInputElement | null>;
  /** 화면에 보여줄 이미지 URL (신규 preview 또는 기존 URL). 제거 시 null */
  displayImageUrl: string | null;
  cropImageSrc: string | null;
  profileImageFile: File | null;
  /** 기존 이미지를 지우거나 새 파일로 교체한 경우 */
  hasImageChange: boolean;
  /** 기존 이미지를 지운 상태 (서버에 s3Key: null 전송 필요) */
  isImageCleared: boolean;
  handleImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleImageButtonClick: () => void;
  handleImageClear: () => void;
  handleCropClose: () => void;
  handleCropComplete: (blob: Blob) => void;
}

/** 프로필 이미지 선택·크롭·미리보기·제거 object URL 정리 */
export const useProfileImageCrop = (
  options: UseProfileImageCropOptions = {}
): UseProfileImageCropResult => {
  const { initialImageUrl = null } = options;
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isImageCleared, setIsImageCleared] = useState(false);

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

  const displayImageUrl =
    previewUrl ?? (isImageCleared ? null : initialImageUrl);

  const hasImageChange = profileImageFile !== null || isImageCleared;

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setCropImageSrc(URL.createObjectURL(file));
  };

  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageClear = () => {
    setProfileImageFile(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setIsImageCleared(true);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleCropClose = () => {
    setCropImageSrc(null);
  };

  const handleCropComplete = (blob: Blob) => {
    const file = new File([blob], 'profile.jpg', {
      type: blob.type || 'image/jpeg',
    });
    setProfileImageFile(file);
    setIsImageCleared(false);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(blob);
    });
    setCropImageSrc(null);
  };

  return {
    imageInputRef,
    displayImageUrl,
    cropImageSrc,
    profileImageFile,
    hasImageChange,
    isImageCleared,
    handleImageChange,
    handleImageButtonClick,
    handleImageClear,
    handleCropClose,
    handleCropComplete,
  };
};
