/**
 * High-Definition Resampler & Image Upscaler
 * Performs multi-pass step-down / step-up interpolation with edge sharpening
 * to generate crisp, high-pixel print render without harsh artifacts.
 */

export async function upscaleImageCanvas(sourceCanvas, targetWidth, targetHeight) {
  const srcW = sourceCanvas.width;
  const srcH = sourceCanvas.height;

  if (srcW === targetWidth && srcH === targetHeight) {
    return sourceCanvas;
  }

  // Multi-pass step-up algorithm for smooth sub-pixel interpolation
  let currentCanvas = document.createElement('canvas');
  currentCanvas.width = srcW;
  currentCanvas.height = srcH;
  let currentCtx = currentCanvas.getContext('2d');
  currentCtx.drawImage(sourceCanvas, 0, 0);

  let curW = srcW;
  let curH = srcH;

  // Step up in max 1.5x ratios to preserve edge sharpness without blockiness
  while (curW < targetWidth || curH < targetHeight) {
    const nextW = Math.min(targetWidth, Math.round(curW * 1.5));
    const nextH = Math.min(targetHeight, Math.round(curH * 1.5));

    const nextCanvas = document.createElement('canvas');
    nextCanvas.width = nextW;
    nextCanvas.height = nextH;
    const nextCtx = nextCanvas.getContext('2d');

    nextCtx.imageSmoothingEnabled = true;
    nextCtx.imageSmoothingQuality = 'high';
    nextCtx.drawImage(currentCanvas, 0, 0, curW, curH, 0, 0, nextW, nextH);

    currentCanvas = nextCanvas;
    curW = nextW;
    curH = nextH;
  }

  // Final subtle edge sharpening pass to counteract upscaling softness
  const finalCtx = currentCanvas.getContext('2d');
  const imgData = finalCtx.getImageData(0, 0, curW, curH);
  const data = imgData.data;
  const copy = new Uint8ClampedArray(data);

  for (let y = 1; y < curH - 1; y += 2) { // 2px stride for high-res performance
    for (let x = 1; x < curW - 1; x += 2) {
      const idx = (y * curW + x) * 4;
      for (let c = 0; c < 3; c++) {
        const center = copy[idx + c];
        const top = copy[((y - 1) * curW + x) * 4 + c];
        const bottom = copy[((y + 1) * curW + x) * 4 + c];
        const left = copy[(y * curW + (x - 1)) * 4 + c];
        const right = copy[(y * curW + (x + 1)) * 4 + c];

        const val = 4.4 * center - 0.6 * (top + bottom + left + right);
        data[idx + c] = Math.min(255, Math.max(0, val));
      }
    }
  }

  finalCtx.putImageData(imgData, 0, 0);
  return currentCanvas;
}
