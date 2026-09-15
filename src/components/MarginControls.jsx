import React from 'react';
import { Square, Maximize2, Minimize2, StretchHorizontal } from 'lucide-react';

export default function MarginControls({ cropState, onChangeCropState }) {
  const borderMm = cropState.borderMm || 0;
  const borderColor = cropState.borderColor || '#ffffff';

  const updateBorderMm = (val) => {
    onChangeCropState({
      ...cropState,
      borderMm: Number(val)
    });
  };

  const updateBorderColor = (color) => {
    onChangeCropState({
      ...cropState,
      borderColor: color
    });
  };

  const borderInches = (borderMm / 25.4).toFixed(2);

  return (
    <div className="margin-controls-card">
      <div className="margin-card-header">
        <Square size={16} className="text-accent" />
        <span className="margin-title">Print Margins & Borders</span>
      </div>

      <div className="margin-body">
        {/* Border Width Slider */}
        <div className="form-group">
          <div className="slider-label-row">
            <span>Border Width (Matting)</span>
            <span className="slider-val">
              {borderMm === 0 ? 'No Border (Full Bleed)' : `${borderMm} mm (${borderInches} in)`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={borderMm}
            onChange={(e) => updateBorderMm(e.target.value)}
            className="slider-input"
          />
        </div>

        {/* Border Color Picker */}
        {borderMm > 0 && (
          <div className="border-color-picker">
            <span className="color-label">Border Color:</span>
            <div className="color-swatches">
              {[
                { name: 'White', color: '#ffffff' },
                { name: 'Off-White / Cream', color: '#fef3c7' },
                { name: 'Light Gray', color: '#e2e8f0' },
                { name: 'Dark Gray', color: '#334155' },
                { name: 'Black', color: '#000000' }
              ].map(swatch => (
                <button
                  key={swatch.color}
                  className={`color-swatch-btn ${borderColor === swatch.color ? 'selected' : ''}`}
                  style={{ backgroundColor: swatch.color }}
                  onClick={() => updateBorderColor(swatch.color)}
                  title={swatch.name}
                />
              ))}
              <input
                type="color"
                value={borderColor}
                onChange={(e) => updateBorderColor(e.target.value)}
                className="color-input-field"
                title="Custom Color"
              />
            </div>
          </div>
        )}

        {/* Fit Mode Explanation Guide */}
        <div className="fit-guide-box">
          <span className="fit-guide-title">Fit Mode Guide:</span>
          <div className="fit-guide-item">
            <strong>Fill:</strong> Fills the entire print paper cleanly. (May crop image edges).
          </div>
          <div className="fit-guide-item">
            <strong>Fit:</strong> Preserves 100% of image without cropping. (May leave unprinted margins).
          </div>
          <div className="fit-guide-item">
            <strong>Stretch:</strong> Forces photo to match print aspect ratio. <em>(Use with caution)</em>.
          </div>
        </div>
      </div>
    </div>
  );
}
