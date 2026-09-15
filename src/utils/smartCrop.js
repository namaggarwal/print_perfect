/**
 * Smart Crop Engine
 * Analyzes image content (saliency, edge density, contrast variance, or FaceDetector API)
 * to intelligently compute crop focal offsets.
 */

export async function detectSmartCrop(imgElement, targetAspect) {
  if (!imgElement || !imgElement.naturalWidth || !imgElement.naturalHeight) {
    return { xPercent: 50, yPercent: 50 }; // Default center
  }

  const srcWidth = imgElement.naturalWidth;
  const srcHeight = imgElement.naturalHeight;

  // 1. Try Native Browser Face Detector API if available (Chrome / Edge with experimental features or Android)
  if ('FaceDetector' in window) {
    try {
      const faceDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 3 });
      const faces = await faceDetector.detect(imgElement);
      if (faces && faces.length > 0) {
        // Average center of detected faces
        let sumX = 0;
        let sumY = 0;
        faces.forEach(face => {
          sumX += face.boundingBox.x + face.boundingBox.width / 2;
          sumY += face.boundingBox.y + face.boundingBox.height / 2;
        });
        const focalX = sumX / faces.length;
        const focalY = sumY / faces.length;
        return {
          xPercent: Math.max(0, Math.min(100, (focalX / srcWidth) * 100)),
          yPercent: Math.max(0, Math.min(100, (focalY / srcHeight) * 100)),
          method: 'Face Detection'
        };
      }
    } catch (e) {
      console.warn('FaceDetector API failed or permission missing, falling back to visual saliency heuristic.', e);
    }
  }

  // 2. Cross-Browser Edge Density / Contrast Saliency Heuristic
  try {
    const canvas = document.createElement('canvas');
    const sampleSize = 128;
    canvas.width = sampleSize;
    canvas.height = sampleSize;
    const ctx = canvas.getContext('2d');

    if (!ctx) return { xPercent: 50, yPercent: 50, method: 'Center Heuristic' };

    ctx.drawImage(imgElement, 0, 0, sampleSize, sampleSize);
    const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize);
    const data = imgData.data;

    let weightedX = 0;
    let weightedY = 0;
    let totalWeight = 0;

    // Luminance array
    const lum = new Float32Array(sampleSize * sampleSize);
    for (let i = 0; i < data.length; i += 4) {
      const idx = i / 4;
      lum[idx] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }

    // Sobel edge gradient computation to find detail/subject regions
    for (let y = 1; y < sampleSize - 1; y++) {
      for (let x = 1; x < sampleSize - 1; x++) {
        const idx = y * sampleSize + x;
        // Simple Sobel gradient magnitude
        const gx = -lum[idx - sampleSize - 1] + lum[idx - sampleSize + 1] - 2 * lum[idx - 1] + 2 * lum[idx + 1] - lum[idx + sampleSize - 1] + lum[idx + sampleSize + 1];
        const gy = -lum[idx - sampleSize - 1] - 2 * lum[idx - sampleSize] - lum[idx - sampleSize + 1] + lum[idx + sampleSize - 1] + 2 * lum[idx + sampleSize] + lum[idx + sampleSize + 1];
        
        const mag = Math.sqrt(gx * gx + gy * gy);
        
        // Give higher weight to center region rule-of-thirds area vs outer extreme edges
        const distFromCenter = Math.hypot(x - sampleSize / 2, y - sampleSize / 2) / (sampleSize / 2);
        const spatialWeight = Math.max(0.2, 1.0 - distFromCenter * 0.5);

        const weight = mag * spatialWeight;
        if (weight > 15) { // Filter out smooth noise
          weightedX += x * weight;
          weightedY += y * weight;
          totalWeight += weight;
        }
      }
    }

    if (totalWeight > 0) {
      const focalX = (weightedX / totalWeight) / sampleSize;
      const focalY = (weightedY / totalWeight) / sampleSize;

      return {
        xPercent: Math.max(10, Math.min(90, Math.round(focalX * 100))),
        yPercent: Math.max(10, Math.min(90, Math.round(focalY * 100))),
        method: 'Visual Saliency'
      };
    }
  } catch (err) {
    console.error('Smart crop visual saliency analysis error', err);
  }

  return { xPercent: 50, yPercent: 50, method: 'Center Default' };
}
