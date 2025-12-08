// frontend/src/utils/imageUtils.ts

/**
 * Resizes an image provided as a Data URL or Blob and returns a new Data URL.
 * @param {string} imageDataUrl The image data URL (e.g., from canvas.toDataURL)
 * @param {number} maxWidth The maximum width for the resized image.
 * @param {number} maxHeight The maximum height for the resized image.
 * @param {number} quality The quality of the output image (0.0 - 1.0). Default to 0.7.
 * @returns {Promise<string>} A promise that resolves with the resized image as a Data URL.
 */
export const resizeImage = (
    imageDataUrl: string,
    maxWidth: number,
    maxHeight: number,
    quality: number = 0.7
): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = imageDataUrl;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                resolve(imageDataUrl); // Return original if context cannot be created
                return;
            }

            let width = img.width;
            let height = img.height;

            // Calculate the new dimensions
            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            // Convert canvas content to a data URL
            resolve(canvas.toDataURL('image/jpeg', quality)); // Using JPEG for smaller size and quality control
        };

        img.onerror = () => {
            resolve(imageDataUrl); // Return original on error
        };
    });
};
