import React, { useState } from 'react';
import { DEFAULT_ADJUSTMENTS, calculateAutoEnhance, isDefaultAdjustments } from '../utils/imageEnhancer';
import { Sparkles, Eye, RotateCcw, Sliders, Sun, Contrast, Droplet, Flame, Zap } from 'lucide-react';

export default function EnhancePanel({ adjustments, onChangeAdjustments, imageData }) {
  const [holdingBefore, setHoldingBefore] = useState(false);

  const updateAdj = (key, val) => {
    onChangeAdjustments({
      ...adjustments,
      [key]: Number(val)
    });
  };

  const handleAutoEnhance = () => {
    if (imageData && imageData.imgElement) {
      const auto = calculateAutoEnhance(imageData.imgElement);
      onChangeAdjustments(auto);
    }
  };

  const handleReset = () => {
    onChangeAdjustments(DEFAULT_ADJUSTMENTS);
  };

  const activeAdj = holdingBefore ? DEFAULT_ADJUSTMENTS : adjustments;

  return (
    <div className="enhance-panel-card">
      <div className="enhance-panel-header">
        <div className="enhance-title">
          <Sliders size={18} className="text-accent" />
          <span>Photo Enhancement</span>
        </div>

        <div className="enhance-header-actions">
          <button
            className="btn btn-accent btn-sm"
            onClick={handleAutoEnhance}
            title="Auto Optimize Contrast, Saturation & Tones"
          >
            <Sparkles size={14} />
            <span>Auto Enhance</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onMouseDown={() => setHoldingBefore(true)}
            onMouseUp={() => setHoldingBefore(false)}
            onMouseLeave={() => setHoldingBefore(false)}
            onTouchStart={() => setHoldingBefore(true)}
            onTouchEnd={() => setHoldingBefore(false)}
            title="Press and hold to see original photo"
          >
            <Eye size={14} />
            <span>{holdingBefore ? 'Showing Original' : 'Hold Before'}</span>
          </button>

          {!isDefaultAdjustments(adjustments) && (
            <button className="btn btn-ghost btn-sm text-subtle" onClick={handleReset} title="Reset all sliders">
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="sliders-grid">
        {/* Exposure */}
        <div className="slider-group">
          <div className="slider-label-row">
            <span>Exposure</span>
            <span className="slider-val">{adjustments.exposure > 0 ? `+${adjustments.exposure}` : adjustments.exposure}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={adjustments.exposure}
            onChange={(e) => updateAdj('exposure', e.target.value)}
            className="slider-input"
          />
        </div>

        {/* Brightness */}
        <div className="slider-group">
          <div className="slider-label-row">
            <span>Brightness</span>
            <span className="slider-val">{adjustments.brightness > 0 ? `+${adjustments.brightness}` : adjustments.brightness}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={adjustments.brightness}
            onChange={(e) => updateAdj('brightness', e.target.value)}
            className="slider-input"
          />
        </div>

        {/* Contrast */}
        <div className="slider-group">
          <div className="slider-label-row">
            <span>Contrast</span>
            <span className="slider-val">{adjustments.contrast > 0 ? `+${adjustments.contrast}` : adjustments.contrast}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={adjustments.contrast}
            onChange={(e) => updateAdj('contrast', e.target.value)}
            className="slider-input"
          />
        </div>

        {/* Saturation */}
        <div className="slider-group">
          <div className="slider-label-row">
            <span>Saturation</span>
            <span className="slider-val">{adjustments.saturation > 0 ? `+${adjustments.saturation}` : adjustments.saturation}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={adjustments.saturation}
            onChange={(e) => updateAdj('saturation', e.target.value)}
            className="slider-input"
          />
        </div>

        {/* Highlights */}
        <div className="slider-group">
          <div className="slider-label-row">
            <span>Highlights</span>
            <span className="slider-val">{adjustments.highlights > 0 ? `+${adjustments.highlights}` : adjustments.highlights}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={adjustments.highlights}
            onChange={(e) => updateAdj('highlights', e.target.value)}
            className="slider-input"
          />
        </div>

        {/* Shadows */}
        <div className="slider-group">
          <div className="slider-label-row">
            <span>Shadows</span>
            <span className="slider-val">{adjustments.shadows > 0 ? `+${adjustments.shadows}` : adjustments.shadows}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={adjustments.shadows}
            onChange={(e) => updateAdj('shadows', e.target.value)}
            className="slider-input"
          />
        </div>

        {/* Warmth */}
        <div className="slider-group">
          <div className="slider-label-row">
            <span>Warmth</span>
            <span className="slider-val">{adjustments.warmth > 0 ? `+${adjustments.warmth}` : adjustments.warmth}</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={adjustments.warmth}
            onChange={(e) => updateAdj('warmth', e.target.value)}
            className="slider-input"
          />
        </div>

        {/* Sharpness */}
        <div className="slider-group">
          <div className="slider-label-row">
            <span>Print Sharpness</span>
            <span className="slider-val">+{adjustments.sharpness}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={adjustments.sharpness}
            onChange={(e) => updateAdj('sharpness', e.target.value)}
            className="slider-input"
          />
        </div>
      </div>
    </div>
  );
}
