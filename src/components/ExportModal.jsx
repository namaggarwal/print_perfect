import React, { useState } from 'react';
import { X, Download, FileImage, Sparkles, CheckCircle2, Archive } from 'lucide-react';
import { renderPrintCanvas, exportCanvasToBlob, downloadAllPrintSizesZip } from '../utils/exportEngine';
import { getRequiredPixels } from '../utils/printUtils';
import confetti from 'canvas-confetti';

export default function ExportModal({
  isOpen,
  onClose,
  imageData,
  activePreset,
  cropState,
  adjustments,
  targetDpi,
  versions = [],
  isUpscaled = false
}) {
  const [format, setFormat] = useState('image/jpeg');
  const [quality, setQuality] = useState(95);
  const [isExporting, setIsExporting] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);

  if (!isOpen || !imageData || !imageData.imgElement || !activePreset) return null;

  const targetWidthIn = cropState.isLandscape ? Math.max(activePreset.widthInches, activePreset.heightInches) : Math.min(activePreset.widthInches, activePreset.heightInches);
  const targetHeightIn = cropState.isLandscape ? Math.min(activePreset.widthInches, activePreset.heightInches) : Math.max(activePreset.widthInches, activePreset.heightInches);
  const reqPx = getRequiredPixels(targetWidthIn, targetHeightIn, targetDpi);

  const handleDownloadSingle = async () => {
    setIsExporting(true);
    setProgressPercent(20);
    setProgressMsg('Rendering print canvas...');

    try {
      const canvas = await renderPrintCanvas({
        imgElement: imageData.imgElement,
        printPreset: activePreset,
        cropState,
        adjustments,
        dpi: targetDpi,
        shouldUpscale: isUpscaled
      });

      setProgressPercent(70);
      setProgressMsg('Injecting DPI metadata headers...');

      const blob = await exportCanvasToBlob(canvas, format, quality / 100, targetDpi);

      setProgressPercent(100);
      setProgressMsg('Download ready!');

      const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';
      const cleanName = `${imageData.fileName ? imageData.fileName.replace(/\.[^/.]+$/, '') : 'Photo'}_${activePreset.name.replace(/[^a-zA-Z0-9]/g, '_')}_${targetDpi}dpi.${ext}`;

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = cleanName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Trigger celebratory confetti
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });

      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 800);
    } catch (err) {
      console.error('Export error', err);
      setIsExporting(false);
      alert('Failed to render export file: ' + err.message);
    }
  };

  const handleDownloadAllZip = async () => {
    setIsExporting(true);
    try {
      const zipBlob = await downloadAllPrintSizesZip({
        imgElement: imageData.imgElement,
        versions,
        filenamePrefix: imageData.fileName ? imageData.fileName.replace(/\.[^/.]+$/, '') : 'Photo',
        format,
        quality: quality / 100,
        dpi: targetDpi,
        onProgress: (percent, msg) => {
          setProgressPercent(Math.round(percent));
          setProgressMsg(msg);
        }
      });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `PrintPerfect_Batch_${targetDpi}DPI.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });

      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 800);
    } catch (err) {
      console.error('ZIP batch export error', err);
      setIsExporting(false);
      alert('Failed to create ZIP archive: ' + err.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content export-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Download className="text-accent" size={20} />
            <h3>Export Print-Ready Image</h3>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="export-body">
          {/* Target Specs Summary Card */}
          <div className="export-summary-card">
            <div className="summary-row">
              <span>Print Dimensions:</span>
              <strong>{targetWidthIn} × {targetHeightIn} in ({activePreset.name})</strong>
            </div>
            <div className="summary-row">
              <span>Render Resolution:</span>
              <strong className="text-accent">{reqPx.width} × {reqPx.height} pixels</strong>
            </div>
            <div className="summary-row">
              <span>Target Quality Density:</span>
              <strong>{targetDpi} PPI (Embedded EXIF/pHYs)</strong>
            </div>
          </div>

          {/* Format Selector */}
          <div className="form-group mt-3">
            <label className="form-label">Export Format:</label>
            <div className="format-pills">
              {[
                { id: 'image/jpeg', name: 'JPG (Best for Photos)', ext: 'jpg' },
                { id: 'image/png', name: 'PNG (Lossless Graphics)', ext: 'png' },
                { id: 'image/webp', name: 'WebP (Compact High Quality)', ext: 'webp' }
              ].map(f => (
                <button
                  key={f.id}
                  className={`format-pill ${format === f.id ? 'active' : ''}`}
                  onClick={() => setFormat(f.id)}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quality Slider for JPG */}
          {format === 'image/jpeg' && (
            <div className="form-group mt-3">
              <div className="slider-label-row">
                <span>JPEG Quality:</span>
                <span className="slider-val">{quality}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="slider-input"
              />
            </div>
          )}

          {/* Progress Bar when rendering */}
          {isExporting && (
            <div className="export-progress-container">
              <div className="progress-label">
                <span>{progressMsg}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {versions.length > 1 && (
            <button
              className="btn btn-secondary"
              onClick={handleDownloadAllZip}
              disabled={isExporting}
            >
              <Archive size={16} />
              <span>Download All {versions.length} Sizes (ZIP)</span>
            </button>
          )}

          <button
            className="btn btn-primary"
            onClick={handleDownloadSingle}
            disabled={isExporting}
          >
            <Download size={18} />
            <span>Download Print-Ready Image</span>
          </button>
        </div>
      </div>
    </div>
  );
}
