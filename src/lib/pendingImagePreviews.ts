/** 이미지 첨부 preview — ChatComposer·게시글 작성 공통 */

export interface PendingImageFile {
  file: File;
  previewUrl: string;
}

export const createPendingImageFiles = (files: File[]): PendingImageFile[] =>
  files.map((file) => ({
    file,
    previewUrl: URL.createObjectURL(file),
  }));

export const revokePendingImageFile = (item: PendingImageFile) => {
  URL.revokeObjectURL(item.previewUrl);
};

export const revokePendingImageFiles = (items: PendingImageFile[]) => {
  items.forEach(revokePendingImageFile);
};
