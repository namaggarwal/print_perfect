/**
 * High-definition sample photographs generated client-side via HTML5 Canvas
 * to allow immediate instant testing without requiring an initial upload.
 */

function createSampleCanvas(type, width = 3840, height = 2560) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (type === 'landscape') {
    // Vibrant Sunset Mountain Landscape
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.6);
    skyGrad.addColorStop(0, '#0f172a');
    skyGrad.addColorStop(0.3, '#312e81');
    skyGrad.addColorStop(0.6, '#9333ea');
    skyGrad.addColorStop(0.85, '#f43f5e');
    skyGrad.addColorStop(1, '#fb923c');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Glowing Sun
    ctx.beginPath();
    ctx.arc(width * 0.65, height * 0.55, 240, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#fde047';
    ctx.shadowBlur = 120;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Distant Mountain Ranges
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.6);
    ctx.lineTo(width * 0.2, height * 0.35);
    ctx.lineTo(width * 0.4, height * 0.55);
    ctx.lineTo(width * 0.65, height * 0.3);
    ctx.lineTo(width * 0.85, height * 0.58);
    ctx.lineTo(width, height * 0.42);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Foreground Mountains & Lake Reflection
    const waterGrad = ctx.createLinearGradient(0, height * 0.68, 0, height);
    waterGrad.addColorStop(0, '#1e1b4b');
    waterGrad.addColorStop(1, '#0284c7');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, height * 0.68, width, height * 0.32);
  } else if (type === 'portrait') {
    // Studio Portrait Mockup with Warm Lighting
    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, width);
    bgGrad.addColorStop(0, '#38bdf8');
    bgGrad.addColorStop(0.5, '#0369a1');
    bgGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Silhouette Subject with Studio Rim Lighting
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(width / 2, height * 0.38, 420, 0, Math.PI * 2); // Head
    ctx.fill();

    ctx.beginPath(); // Shoulders
    ctx.ellipse(width / 2, height * 0.9, 900, 500, 0, 0, Math.PI * 2);
    ctx.fill();

    // Glowing rim light stroke
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 24;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 60;
    ctx.stroke();
  } else if (type === 'architecture') {
    // Modern Geometry Architecture
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#1e293b');
    grad.addColorStop(1, '#334155');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Diagonal Glass Facet Panels
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(129, 140, 248, 0.1)';
      ctx.beginPath();
      ctx.moveTo(i * (width / 6), 0);
      ctx.lineTo((i + 2) * (width / 6), height);
      ctx.lineTo((i + 1) * (width / 6), height);
      ctx.lineTo((i - 1) * (width / 6), 0);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Add subtle texture grain & watermark text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = 'bold 72px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('PRINTPERFECT SAMPLE (4K Ultra-HD)', width - 80, height - 80);

  return canvas.toDataURL('image/jpeg', 0.92);
}

export const SAMPLE_PHOTOS = [
  {
    id: 'sunset_landscape',
    title: 'Sunset Mountains (3840×2560)',
    category: 'Landscape',
    aspect: '3:2',
    src: null, // Generated lazily
    getType: () => createSampleCanvas('landscape', 3840, 2560)
  },
  {
    id: 'studio_portrait',
    title: 'Studio Portrait (3000×4000)',
    category: 'Portrait',
    aspect: '3:4',
    src: null,
    getType: () => createSampleCanvas('portrait', 3000, 4000)
  },
  {
    id: 'modern_arch',
    title: 'Modern Architecture (4000×3000)',
    category: 'Architecture',
    aspect: '4:3',
    src: null,
    getType: () => createSampleCanvas('architecture', 4000, 3000)
  }
];
