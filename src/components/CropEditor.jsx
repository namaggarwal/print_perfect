import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Grid,
  Sparkles,
  Maximize,
  Minimize,
  RefreshCw,
  Sliders,
  Move
} from 'lucide-react';
import { detectSmartCrop } from '../utils/smartCrop';
import { getCssFilterString } from '../utils/imageEnhancer';

export default function CropEditor({
  imageData,
  printPreset,
  cropState,
  onChangeCropState,
  adjustments,
  onOpenEnhance
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [isSmartCropping, setIsSmartCropping] = useState(false);

  const { imgElement } = imageData;

  // Target aspect ratio computation
  const targetW = cropState.isLandscape ? Math.max(printPreset.widthInches, printPreset.heightInches) : Math.min(printPreset.widthInches, printPreset.heightInches);
  const targetH = cropState.isLandscape ? Math.min(printPreset.widthInches, printPreset.heightInches) : Math.max(printPreset.widthInches, printPreset.heightInches);
  const printAspect = targetW / targetH;

  // Draw preview canvas
  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgElement) return;

    const ctx = canvas.getContext('2d');
    const container = containerRef.current;
    if (!container) return;

    const maxW = container.clientWidth - 40;
    const maxH = container.clientHeight - 40;

    let drawWidth = maxW;
    let drawHeight = maxW / printAspect;

    if (drawHeight > maxH) {
      drawHeight = maxH;
      drawWidth = maxH * printAspect;
    }

    canvas.width = Math.round(drawWidth);
    canvas.height = Math.round(drawHeight);

    // Fill canvas background (border color)
    ctx.fillStyle = cropState.borderColor || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate Inset Border
    const borderMm = cropState.borderMm || 0;
    const borderPx = (borderMm / 25.4) * (canvas.width / targetW);

    const innerW = Math.max(1, canvas.width - borderPx * 2);
    const innerH = Math.max(1, canvas.height - borderPx * 2);

    ctx.save();
    ctx.beginPath();
    ctx.rect(borderPx, borderPx, innerW, innerH);
    ctx.clip();

    ctx.translate(borderPx + innerW / 2, borderPx + innerH / 2);

    // Rotation & Flips
    const rad = ((cropState.rotation || 0) * Math.PI) / 180;
    ctx.rotate(rad);
    ctx.scale(cropState.flipH ? -1 : 1, cropState.flipV ? -1 : 1);

    const imgW = imgElement.naturalWidth;
    const imgH = imgElement.naturalHeight;
    const imgAspect = imgW / imgH;
    const frameAspect = innerW / innerH;

    let renderW = innerW;
    let renderH = innerH;

    const fitMode = cropState.fitMode || 'fill';

    if (fitMode === 'fill' || fitMode === 'smart') {
      if (imgAspect > frameAspect) {
        renderH = innerH;
        renderW = innerH * imgAspect;
      } else {
        renderW = innerW;
        renderH = innerW / imgAspect;
      }
    } else if (fitMode === 'fit') {
      if (imgAspect > frameAspect) {
        renderW = innerW;
        renderH = innerW / imgAspect;
      } else {
        renderH = innerH;
        renderW = innerH * imgAspect;
      }
    } else if (fitMode === 'stretch') {
      renderW = innerW;
      renderH = innerH;
    }

    const zoom = cropState.zoom || 1;
    renderW *= zoom;
    renderH *= zoom;

    const userPanX = (cropState.panX || 0) * (innerW / 100);
    const userPanY = (cropState.panY || 0) * (innerH / 100);

    // Apply Live CSS Filter for preview adjustments
    if (adjustments) {
      ctx.filter = getCssFilterString(adjustments);
    }

    ctx.drawImage(imgElement, -renderW / 2 + userPanX, -renderH / 2 + userPanY, renderW, renderH);

    ctx.restore();
  }, [imgElement, printAspect, targetW, cropState, adjustments]);

  useEffect(() => {
    drawPreview();
    window.addEventListener('resize', drawPreview);
    return () => window.removeEventListener('resize', drawPreview);
  }, [drawPreview]);

  // Drag Pan handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !canvasRef.current) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    const sensitivity = 0.4;
    const newPanX = (cropState.panX || 0) + deltaX * sensitivity;
    const newPanY = (cropState.panY || 0) + deltaY * sensitivity;

    onChangeCropState({
      ...cropState,
      panX: Math.max(-150, Math.min(150, newPanX)),
      panY: Math.max(-150, Math.min(150, newPanY))
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile pan & pinch-zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStart.x;
    const deltaY = e.touches[0].clientY - dragStart.y;

    const newPanX = (cropState.panX || 0) + deltaX * 0.4;
    const newPanY = (cropState.panY || 0) + deltaY * 0.4;

    onChangeCropState({
      ...cropState,
      panX: Math.max(-150, Math.min(150, newPanX)),
      panY: Math.max(-150, Math.min(150, newPanY))
    });

    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    const newZoom = Math.max(0.5, Math.min(4.0, (cropState.zoom || 1) + delta));
    onChangeCropState({ ...cropState, zoom: Number(newZoom.toFixed(2)) });
  };

  // Smart Crop Action
  const handleSmartCropClick = async () => {
    setIsSmartCropping(true);
    const focal = await detectSmartCrop(imgElement, printAspect);

    // Translate focal percentage into pan offsets
    const targetPanX = (50 - focal.xPercent) * 1.2;
    const targetPanY = (50 - focal.yPercent) * 1.2;

    onChangeCropState({
      ...cropState,
      panX: Math.round(targetPanX),
      panY: Math.round(targetPanY),
      fitMode: 'fill',
      zoom: 1
    });

    setTimeout(() => setIsSmartCropping(false), 300);
  };

  const toggleOrientation = () => {
    onChangeCropState({
      ...cropState,
      isLandscape: !cropState.isLandscape,
      panX: 0,
      panY: 0
    });
  };

  return (
    <div className="crop-editor-wrapper">
      {/* Editor Main Canvas Stage */}
      <div
        className="canvas-stage"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        onWheel={handleWheel}
      >
        <div className="canvas-frame-container">
          <canvas ref={canvasRef} className="preview-canvas" />

          {/* Rule of Thirds Grid Overlay */}
          {showGrid && (
            <div className="grid-overlay pointer-events-none">
              <div className="grid-line line-v-1" />
              <div className="grid-line line-v-2" />
              <div className="grid-line line-h-1" />
              <div className="grid-line line-h-2" />
            </div>
          )}

          {/* Aspect Ratio Badge */}
          <div className="canvas-size-badge">
            {targetW} × {targetH} in ({printPreset.name})
          </div>
        </div>
      </div>

      {/* Editor Control Toolbars */}
      <div className="editor-controls-bar">
        <div className="controls-group">
          <button className="btn btn-secondary btn-sm" onClick={handleSmartCropClick} disabled={isSmartCropping} title="Auto-detect subject center">
            <Sparkles size={16} className="text-accent" />
            <span>{isSmartCropping ? 'Analyzing...' : 'Smart Crop'}</span>
          </button>

          <button className="btn btn-secondary btn-sm" onClick={toggleOrientation} title="Rotate Print (Portrait / Landscape)">
            <RefreshCw size={16} />
            <span>{cropState.isLandscape ? 'Landscape' : 'Portrait'}</span>
          </button>

          <div className="control-divider" />

          {/* Zoom controls */}
          <button className="icon-btn" onClick={() => onChangeCropState({ ...cropState, zoom: Math.max(0.5, (cropState.zoom || 1) - 0.1) })} title="Zoom Out">
            <ZoomOut size={16} />
          </button>
          <input
            type="range"
            min="0.5"
            max="4.0"
            step="0.05"
            value={cropState.zoom || 1}
            onChange={(e) => onChangeCropState({ ...cropState, zoom: parseFloat(e.target.value) })}
            className="slider-input slider-sm"
          />
          <button className="icon-btn" onClick={() => onChangeCropState({ ...cropState, zoom: Math.min(4.0, (cropState.zoom || 1) + 0.1) })} title="Zoom In">
            <ZoomIn size={16} />
          </button>

          <div className="control-divider" />

          {/* Rotations */}
          <button className="icon-btn" onClick={() => onChangeCropState({ ...cropState, rotation: ((cropState.rotation || 0) - 90 + 360) % 360 })} title="Rotate -90°">
            <RotateCcw size={16} />
          </button>
          <button className="icon-btn" onClick={() => onChangeCropState({ ...cropState, rotation: ((cropState.rotation || 0) + 90) % 360 })} title="Rotate +90°">
            <RotateCw size={16} />
          </button>

          {/* Flips */}
          <button className={`icon-btn ${cropState.flipH ? 'active' : ''}`} onClick={() => onChangeCropState({ ...cropState, flipH: !cropState.flipH })} title="Flip Horizontal">
            <FlipHorizontal size={16} />
          </button>
          <button className={`icon-btn ${cropState.flipV ? 'active' : ''}`} onClick={() => onChangeCropState({ ...cropState, flipV: !cropState.flipV })} title="Flip Vertical">
            <FlipVertical size={16} />
          </button>

          <div className="control-divider" />

          <button className={`icon-btn ${showGrid ? 'active' : ''}`} onClick={() => setShowGrid(!showGrid)} title="Toggle Rule of Thirds Grid">
            <Grid size={16} />
          </button>

          <button className="btn btn-secondary btn-sm" onClick={onOpenEnhance}>
            <Sliders size={16} />
            <span>Enhance</span>
          </button>

          <button
            className="btn btn-ghost btn-sm text-subtle"
            onClick={() => onChangeCropState({ ...cropState, zoom: 1, panX: 0, panY: 0, rotation: 0, flipH: false, flipV: false, fitMode: 'fill' })}
            title="Reset Crop & Position"
          >
            Reset
          </button>
        </div>

        {/* Fit Mode Selector Pills */}
        <div className="fit-modes-row">
          <span className="fit-label">Fit Mode:</span>
          {['fill', 'fit', 'stretch'].map((mode) => (
            <button
              key={mode}
              className={`fit-pill ${cropState.fitMode === mode ? 'active' : ''}`}
              onClick={() => onChangeCropState({ ...cropState, fitMode: mode })}
            >
              {mode === 'fill' ? 'Fill (Crop)' : mode === 'fit' ? 'Fit (Contain)' : 'Stretch'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
