/**
 * Unit conversion & Print math utilities
 */

export function convertToInches(val, unit) {
  const num = parseFloat(val) || 0;
  if (unit === 'cm') return num / 2.54;
  if (unit === 'mm') return num / 25.4;
  return num; // 'in'
}

export function convertFromInches(inchesVal, targetUnit) {
  const num = parseFloat(inchesVal) || 0;
  if (targetUnit === 'cm') return Number((num * 2.54).toFixed(2));
  if (targetUnit === 'mm') return Number((num * 25.4).toFixed(1));
  return Number(num.toFixed(2));
}

export function getRequiredPixels(widthIn, heightIn, dpi = 300) {
  return {
    width: Math.round(widthIn * dpi),
    height: Math.round(heightIn * dpi),
    totalPixels: Math.round(widthIn * dpi) * Math.round(heightIn * dpi)
  };
}

export function formatDimensions(widthIn, heightIn, unit = 'in') {
  if (unit === 'cm') {
    const w = (widthIn * 2.54).toFixed(1);
    const h = (heightIn * 2.54).toFixed(1);
    return `${w} × ${h} cm`;
  }
  if (unit === 'mm') {
    const w = Math.round(widthIn * 25.4);
    const h = Math.round(heightIn * 25.4);
    return `${w} × ${h} mm`;
  }
  return `${Number(widthIn.toFixed(2))} × ${Number(heightIn.toFixed(2))} in`;
}

export function calculateQuality({ srcWidth, srcHeight, targetWidthIn, targetHeightIn, targetDpi = 300 }) {
  if (!srcWidth || !srcHeight || !targetWidthIn || !targetHeightIn) {
    return { status: 'unknown', text: 'Dimensions unavailable' };
  }

  const reqWidth = Math.round(targetWidthIn * targetDpi);
  const reqHeight = Math.round(targetHeightIn * targetDpi);

  // Compute effective PPI considering aspect ratio crop
  const widthRatio = srcWidth / targetWidthIn;
  const heightRatio = srcHeight / targetHeightIn;
  const effectivePpi = Math.round(Math.min(widthRatio, heightRatio));

  const ppiPercentage = Math.min(100, Math.round((effectivePpi / targetDpi) * 100));

  let status = 'excellent';
  let badgeColor = '#10b981'; // Green
  let title = '🟢 Excellent quality';

  if (effectivePpi >= targetDpi * 0.9) {
    status = 'excellent';
    badgeColor = '#10b981';
    title = '🟢 Excellent quality';
  } else if (effectivePpi >= 200) {
    status = 'good';
    badgeColor = '#eab308'; // Yellow/Gold
    title = '🟡 Good quality';
  } else if (effectivePpi >= 140) {
    status = 'acceptable';
    badgeColor = '#f97316'; // Orange
    title = '🟠 Acceptable quality';
  } else {
    status = 'low';
    badgeColor = '#ef4444'; // Red
    title = '🔴 Low resolution';
  }

  const formattedPrintSize = `${targetWidthIn} × ${targetHeightIn} in`;
  
  let explanation = `This image has enough pixels (${effectivePpi} PPI available) for an excellent-quality ${formattedPrintSize} print at ${targetDpi} PPI.`;
  if (status === 'good') {
    explanation = `This image has ${effectivePpi} PPI for an ${formattedPrintSize} print. It will look clear when viewed at normal distance.`;
  } else if (status === 'acceptable') {
    explanation = `This image has ${effectivePpi} PPI for an ${formattedPrintSize} print. Fine details may be slightly soft.`;
  } else if (status === 'low') {
    explanation = `This image is ${srcWidth}×${srcHeight} px, yielding ${effectivePpi} PPI for an ${formattedPrintSize} print. Consider improving resolution or selecting a smaller print size.`;
  }

  return {
    status,
    title,
    badgeColor,
    effectivePpi,
    targetDpi,
    ppiPercentage,
    reqWidth,
    reqHeight,
    srcWidth,
    srcHeight,
    explanation
  };
}

export function estimateMegapixels(width, height) {
  const mp = (width * height) / 1000000;
  return mp.toFixed(1);
}

export function formatFileSize(bytes) {
  if (!bytes) return 'Unknown size';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
