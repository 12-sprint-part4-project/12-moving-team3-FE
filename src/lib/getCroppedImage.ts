import type { Area } from 'react-easy-crop';

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.crossOrigin = 'anonymous';
    image.src = src;
  });

/**
 * react-easy-crop의 croppedAreaPixels로 이미지를 잘라 Blob을 반환한다.
 */
export const getCroppedImage = async (
  imageSrc: string,
  croppedAreaPixels: Area,
  mimeType = 'image/jpeg'
): Promise<Blob> => {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas를 사용할 수 없습니다.');
  }

  const { width, height, x, y } = croppedAreaPixels;
  canvas.width = width;
  canvas.height = height;

  context.drawImage(image, x, y, width, height, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('이미지 변환에 실패했습니다.'));
          return;
        }
        resolve(blob);
      },
      mimeType,
      0.92
    );
  });
};
