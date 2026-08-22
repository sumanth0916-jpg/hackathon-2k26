/**
 * Compresses an image File using HTML Canvas before upload or AI analysis
 */
export async function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<{ file: File; dataUrl: string; base64Data: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while bounding within max dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas 2d context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        const base64Data = dataUrl.split(',')[1];

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image blob'));
              return;
            }
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
              type: mimeType,
              lastModified: Date.now(),
            });
            resolve({
              file: compressedFile,
              dataUrl,
              base64Data,
              mimeType,
            });
          },
          mimeType,
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Converts a Blob or File to Base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
