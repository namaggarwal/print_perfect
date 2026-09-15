import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Eye, Monitor, Check, Download, RefreshCw, Square, Sliders, Image } from 'lucide-react';
import { renderPrintCanvas } from '../utils/exportEngine';
import { PRINT_PRESETS } from '../constants/printPresets';

export default function PrintPreviewModal({
  isOpen,
  onClose,
  imageData,
  activePreset,
  cropState,
  onChangeCropState,
  adjustments,
  targetDpi,
  onSelectPreset,
  onExportClick
}) {
  const [bgMode, setBgMode] = useState('framed'); // 'framed', 'dark', 'gray', 'white'
  const [showActualSize, setShowActualSize] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const canvasRef = useRef(null);

  // Redraw preview canvas whenever props or local states update
  const drawPreviewCanvas = useCallback(async () => {
    if (!isOpen || !imageData || !imageData.imgElement || !activePreset) return;

    setIsRendering(true);
    try {
      const renderedCanvas = await renderPrintCanvas({
        imgElement: imageData.imgElement,
        printPreset: activePreset,
        cropState,
        adjustments,
        dpi: 150 // 150 DPI preview speed
      });

      const targetCanvas = canvasRef.current;
      if (targetCanvas) {
        targetCanvas.width = renderedCanvas.width;
        targetCanvas.height = renderedCanvas.height;
        const ctx = targetCanvas.getContext('2d');
        ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
        ctx.drawImage(renderedCanvas, 0, 0);
      }
    } catch (err) {
      console.error('Preview render error', err);
    } finally {
      setIsRendering(false);
    }
  }, [isOpen, imageData, activePreset, cropState, adjustments]);

  useEffect(() => {
    if (isOpen) {
      // Use requestAnimationFrame to ensure canvas element ref is attached in DOM
      const animId = requestAnimationFrame(() => {
        drawPreviewCanvas();
      });
      return () => cancelAnimationFrame(animId);
    }
  }, [isOpen, bgMode, showActualSize, cropState, activePreset, adjustments, drawPreviewCanvas]);

  if (!isOpen) return null;

  const toggleOrientation = () => {
    if (!onChangeCropState) return;
    onChangeCropState({
      ...cropState,
      isLandscape: !cropState.isLandscape,
      panX: 0,
      panY: 0
    });
  };

  const updateFitMode = (mode) => {
    if (!onChangeCropState) return;
    onChangeCropState({
      ...cropState,
      fitMode: mode
    });
  };

  const updateBorderMm = (mm) => {
    if (!onChangeCropState) return;
    onChangeCropState({
      ...cropState,
      borderMm: Number(mm)
    });
  };

  const updateBorderColor = (color) => {
    if (!onChangeCropState) return;
    onChangeCropState({
      ...cropState,
      borderColor: color
    });
  };

  const borderMm = cropState?.borderMm || 0;
  const borderColor = cropState?.borderColor || '#ffffff';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content preview-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <Eye className="text-accent" size={22} />
            <h3>Realistic Print Preview</h3>
            {isRendering && <span className="rendering-indicator">Updating preview...</span>}
          </div>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Toolbar 1: Background & Display Modes */}
        <div className="preview-toolbar">
          <div className="bg-selector">
            <span>Environment:</span>
            {[
              { id: 'framed', label: '🖼️ Framed Wall' },
              { id: 'dark', label: '🌙 Dark Studio' },
              { id: 'gray', label: '🔘 Light Gray' },
              { id: 'white', label: '☀️ Clean White' }
            ].map(mode => (
              <button
                key={mode.id}
                className={`bg-tab ${bgMode === mode.id ? 'active' : ''}`}
                onClick={() => setBgMode(mode.id)}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <button
            className={`btn btn-sm ${showActualSize ? 'btn-accent' : 'btn-secondary'}`}
            onClick={() => setShowActualSize(!showActualSize)}
          >
            <Monitor size={14} />
            <span>{showActualSize ? '100% Actual Scale' : 'Fit Screen'}</span>
          </button>
        </div>

        {/* Toolbar 2: Interactive Controls inside Preview */}
        <div className="preview-sub-toolbar">
          {/* Orientation */}
          <button className="btn btn-secondary btn-sm" onClick={toggleOrientation} title="Toggle Orientation">
            <RefreshCw size={14} />
            <span>{cropState.isLandscape ? 'Landscape' : 'Portrait'}</span>
          </button>

          {/* Fit Modes */}
          <div className="fit-pills-group">
            <span className="text-subtle text-xs mr-1">Fit:</span>
            {['fill', 'fit', 'stretch'].map(mode => (
              <button
                key={mode}
                className={`fit-pill ${cropState.fitMode === mode ? 'active' : ''}`}
                onClick={() => updateFitMode(mode)}
              >
                {mode === 'fill' ? 'Fill (Crop)' : mode === 'fit' ? 'Fit (Contain)' : 'Stretch'}
              </button>
            ))}
          </div>

          {/* Border Matting Control */}
          <div className="matting-control-inline">
            <span className="text-subtle text-xs">Border:</span>
            <input
              type="range"
              min="0"
              max="50"
              value={borderMm}
              onChange={(e) => updateBorderMm(e.target.value)}
              className="slider-input slider-sm"
              title="Border matting width (mm)"
            />
            <span className="text-xs font-mono">{borderMm}mm</span>

            {borderMm > 0 && (
              <div className="color-swatches-inline">
                {['#ffffff', '#fef3c7', '#e2e8f0', '#334155', '#000000'].map(col => (
                  <button
                    key={col}
                    className={`color-swatch-btn ${borderColor === col ? 'selected' : ''}`}
                    style={{ backgroundColor: col }}
                    onClick={() => updateBorderColor(col)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Stage Display */}
        <div className={`preview-stage-container bg-mode-${bgMode}`}>
          <div className={`stage-frame-wrapper ${bgMode === 'framed' ? 'has-picture-frame' : ''} ${showActualSize ? 'actual-size-scale' : ''}`}>
            {bgMode === 'framed' ? (
              <div className="picture-frame">
                <canvas ref={canvasRef} className="preview-rendered-canvas" />
              </div>
            ) : (
              <div className="paper-sheet">
                <canvas ref={canvasRef} className="preview-rendered-canvas" />
              </div>
            )}
          </div>
        </div>

        {showActualSize && (
          <p className="screen-disclaimer">
            * Physical display scale is approximate based on standard desktop/mobile screen DPI.
          </p>
        )}

        {/* Footer Summary & Action */}
        <div className="modal-footer">
          <div className="print-specs-summary">
            <span><strong>Size:</strong> {activePreset.name}</span>
            <span><strong>Target:</strong> {targetDpi} PPI</span>
            <span><strong>Orientation:</strong> {cropState.isLandscape ? 'Landscape' : 'Portrait'}</span>
            <span><strong>Fit:</strong> {cropState.fitMode || 'fill'}</span>
          </div>

          <button className="btn btn-primary" onClick={() => { onClose(); onExportClick(); }}>
            <Download size={18} />
            <span>Proceed to Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}
