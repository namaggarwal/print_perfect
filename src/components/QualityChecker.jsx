import React, { useState } from 'react';
import { DPI_OPTIONS } from '../constants/printPresets';
import { calculateQuality } from '../utils/printUtils';
import { ShieldCheck, AlertTriangle, Sparkles, CheckCircle, XCircle } from 'lucide-react';

export default function QualityChecker({
  imageData,
  activePreset,
  targetDpi,
  onChangeDpi,
  onImproveResolution,
  isUpscaled
}) {
  const [customDpiInput, setCustomDpiInput] = useState(targetDpi);
  const [showCustomDpi, setShowCustomDpi] = useState(false);

  if (!imageData || !imageData.imgElement || !activePreset) return null;

  const srcW = imageData.imgElement.naturalWidth;
  const srcH = imageData.imgElement.naturalHeight;

  const quality = calculateQuality({
    srcWidth: srcW,
    srcHeight: srcH,
    targetWidthIn: activePreset.widthInches,
    targetHeightIn: activePreset.heightInches,
    targetDpi
  });

  const handleCustomDpiSubmit = (e) => {
    e.preventDefault();
    const parsed = parseInt(customDpiInput, 10);
    if (parsed && parsed >= 72 && parsed <= 1200) {
      onChangeDpi(parsed);
      setShowCustomDpi(false);
    }
  };

  return (
    <div className="quality-checker-card">
      <div className="quality-card-header">
        <div className="quality-title-group">
          <span className="quality-badge" style={{ backgroundColor: quality.badgeColor + '20', color: quality.badgeColor, borderColor: quality.badgeColor + '50' }}>
            {quality.title}
          </span>
          {isUpscaled && <span className="upscaled-pill"><Sparkles size={12} /> HD Resampled</span>}
        </div>

        {/* Target PPI Selector */}
        <div className="ppi-selector">
          <label>Target Quality:</label>
          <select
            value={showCustomDpi ? 'custom' : targetDpi}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                setShowCustomDpi(true);
              } else {
                setShowCustomDpi(false);
                onChangeDpi(Number(e.target.value));
              }
            }}
            className="select-field select-sm"
          >
            {DPI_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.value} PPI {opt.default ? '(Recommended)' : ''}
              </option>
            ))}
            <option value="custom">Custom PPI...</option>
          </select>
        </div>
      </div>

      {showCustomDpi && (
        <form onSubmit={handleCustomDpiSubmit} className="custom-dpi-form">
          <input
            type="number"
            min="72"
            max="1200"
            value={customDpiInput}
            onChange={(e) => setCustomDpiInput(e.target.value)}
            placeholder="e.g. 300"
            className="input-field input-sm"
          />
          <button type="submit" className="btn btn-secondary btn-sm">Set PPI</button>
        </form>
      )}

      <div className="quality-details-box">
        <div className="quality-px-row">
          <span><strong>Required:</strong> {quality.reqWidth} × {quality.reqHeight} px</span>
          <span className="px-divider">•</span>
          <span><strong>Your image:</strong> {quality.srcWidth} × {quality.srcHeight} px</span>
        </div>

        <div className="quality-progress-bar">
          <div
            className="quality-progress-fill"
            style={{ width: `${quality.ppiPercentage}%`, backgroundColor: quality.badgeColor }}
          />
        </div>

        <p className="quality-explanation">{quality.explanation}</p>

        {quality.status === 'low' && !isUpscaled && (
          <div className="upscale-suggestion">
            <div className="upscale-text">
              <AlertTriangle size={16} className="text-amber" />
              <span>Your image may be too small for a high-sharpness print at this size.</span>
            </div>
            <button className="btn btn-accent btn-sm mt-2" onClick={onImproveResolution}>
              <Sparkles size={14} />
              <span>Improve Resolution (Local Resample)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
