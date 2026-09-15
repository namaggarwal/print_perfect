/**
 * Real-time Image Enhancement & Adjustments Engine
 * Processes adjustments both in CSS preview string format and 
 * directly on Canvas pixel data during high-res rendering.
 */

export const DEFAULT_ADJUSTMENTS = {
  brightness: 0,   // -100 to +100
  contrast: 0,     // -100 to +100
  saturation: 0,   // -100 to +100
  exposure: 0,     // -100 to +100
  highlights: 0,   // -100 to +100
  shadows: 0,      // -100 to +100
  warmth: 0,       // -100 (cool) to +100 (warm)
  sharpness: 0,    // 0 to 100
  blur: 0,         // 0 to 10
  autoEnhanced: false
};

/**
 * Builds CSS filter string for live real-time GPU hardware-accelerated preview
 */
export function getCssFilterString(adj) {
  const brightnessVal = 100 + adj.brightness * 0.5 + adj.exposure * 0.5;
  const contrastVal = 100 + adj.contrast * 0.8;
  const saturateVal = 100 + adj.saturation * 0.9;
  const blurVal = adj.blur * 0.5;

  let filter = `brightness(${Math.max(0, brightnessVal)}%) contrast(${Math.max(0, contrastVal)}%) saturate(${Math.max(0, saturateVal)}%)`;

  if (blurVal > 0) {
    filter += ` blur(${blurVal}px)`;
  }

  // Warmth filter approximation via sepia / hue-rotate
  if (adj.warmth !== 0) {
    if (adj.warmth > 0) {
      filter += ` sepia(${adj.warmth * 0.25}%)`;
    } else {
      filter += ` hue-rotate(${adj.warmth * 0.3}deg)`;
    }
  }

  return filter;
}

/**
 * Applies fine adjustments directly to an HTML5 Canvas Context pixel array for final high-res export rendering
 */
export function applyCanvasAdjustments(ctx, width, height, adj) {
  if (isDefaultAdjustments(adj)) return;

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Pre-calculate lookup coefficients
  const bMult = (100 + adj.brightness * 0.6 + adj.exposure * 0.6) / 100;
  const cFactor = (259 * (adj.contrast * 2.55 + 255)) / (255 * (259 - adj.contrast * 2.55));
  const sFactor = (100 + adj.saturation) / 100;
  
  const highlightAdj = adj.highlights * 0.6;
  const shadowAdj = adj.shadows * 0.6;
  const warmthVal = adj.warmth;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // 1. Brightness / Exposure
    r *= bMult;
    g *= bMult;
    b *= bMult;

    // 2. Contrast
    r = cFactor * (r - 128) + 128;
    g = cFactor * (g - 128) + 128;
    b = cFactor * (b - 128) + 128;

    // 3. Highlights & Shadows adjustment
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    if (shadowAdj !== 0 && luminance < 128) {
      const shadowFactor = (1 - luminance / 128) * shadowAdj;
      r += shadowFactor;
      g += shadowFactor;
      b += shadowFactor;
    }
    if (highlightAdj !== 0 && luminance >= 128) {
      const highlightFactor = ((luminance - 128) / 127) * highlightAdj;
      r += highlightFactor;
      g += highlightFactor;
      b += highlightFactor;
    }

    // 4. Warmth (Color Temperature shift)
    if (warmthVal !== 0) {
      r += warmthVal * 0.4;
      b -= warmthVal * 0.4;
    }

    // 5. Saturation
    if (sFactor !== 1) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray + (r - gray) * sFactor;
      g = gray + (g - gray) * sFactor;
      b = gray + (b - gray) * sFactor;
    }

    // Clamp values 0-255
    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }

  ctx.putImageData(imgData, 0, 0);

  // 6. Apply Sharpness Unsharp Mask if requested
  if (adj.sharpness > 0) {
    applyUnsharpMask(ctx, width, height, adj.sharpness / 100);
  }
}

/**
 * Unsharp Mask Sharpness Filter Kernel
 */
function applyUnsharpMask(ctx, width, height, amount) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const copy = new Uint8ClampedArray(data);

  // Simple 3x3 Laplacian sharpening kernel
  // [  0, -1,  0 ]
  // [ -1,  5, -1 ]
  // [  0, -1,  0 ]
  const strength = amount * 0.8;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      for (let c = 0; c < 3; c++) {
        const center = copy[idx + c];
        const top = copy[((y - 1) * width + x) * 4 + c];
        const bottom = copy[((y + 1) * width + x) * 4 + c];
        const left = copy[(y * width + (x - 1)) * 4 + c];
        const right = copy[(y * width + (x + 1)) * 4 + c];

        const laplacian = 5 * center - top - bottom - left - right;
        const sharpened = center + (laplacian - center) * strength;
        data[idx + c] = Math.min(255, Math.max(0, sharpened));
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

export function isDefaultAdjustments(adj) {
  return (
    adj.brightness === 0 &&
    adj.contrast === 0 &&
    adj.saturation === 0 &&
    adj.exposure === 0 &&
    adj.highlights === 0 &&
    adj.shadows === 0 &&
    adj.warmth === 0 &&
    adj.sharpness === 0 &&
    adj.blur === 0
  );
}

/**
 * Computes optimal Auto Enhance values based on image histogram analysis
 */
export function calculateAutoEnhance(imgElement) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgElement, 0, 0, 100, 100);
    const data = ctx.getImageData(0, 0, 100, 100).data;

    let totalLum = 0;
    let minLum = 255;
    let maxLum = 0;

    for (let i = 0; i < data.length; i += 4) {
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      totalLum += lum;
      if (lum < minLum) minLum = lum;
      if (lum > maxLum) maxLum = lum;
    }

    const avgLum = totalLum / 10000;
    
    // Auto tuning formula
    let contrastBump = 15;
    let brightnessBump = 0;

    if (avgLum < 100) {
      brightnessBump = Math.round((120 - avgLum) * 0.3); // Brighten dark photo
    } else if (avgLum > 170) {
      brightnessBump = Math.round((150 - avgLum) * 0.2); // Tone down bright photo
    }

    if (maxLum - minLum < 180) {
      contrastBump = 25; // Boost low contrast photo
    }

    return {
      ...DEFAULT_ADJUSTMENTS,
      brightness: brightnessBump,
      contrast: contrastBump,
      saturation: 12,
      highlights: -10,
      shadows: 15,
      sharpness: 20,
      autoEnhanced: true
    };
  } catch (err) {
    return {
      ...DEFAULT_ADJUSTMENTS,
      brightness: 5,
      contrast: 15,
      saturation: 10,
      sharpness: 15,
      autoEnhanced: true
    };
  }
}
