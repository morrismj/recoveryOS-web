export type CompressOptions = {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
};

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const { maxWidth = 1600, maxHeight = 1600, quality = 0.82, mimeType } = options;
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(maxWidth / bitmap.width, maxHeight / bitmap.height, 1);
  const targetWidth = Math.round(bitmap.width * scale);
  const targetHeight = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas not supported.");
  }

  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

  const outputType = mimeType ?? file.type ?? "image/jpeg";
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error("Image compression failed."));
      },
      outputType,
      quality
    );
  });

  return new File([blob], file.name, { type: outputType });
}
