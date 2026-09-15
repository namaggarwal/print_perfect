import React, { useState } from 'react';
import { PRINT_PRESETS, PRINT_CATEGORIES } from '../constants/printPresets';
import { convertToInches, formatDimensions, getRequiredPixels } from '../utils/printUtils';
import { Sliders, Check, Plus } from 'lucide-react';

export default function PresetSelector({ activePreset, onSelectPreset, dpi = 300 }) {
  const [activeCategory, setActiveCategory] = useState(PRINT_CATEGORIES.POPULAR);
  const [customWidth, setCustomWidth] = useState('8');
  const [customHeight, setCustomHeight] = useState('10');
  const [customUnit, setCustomUnit] = useState('in');

  const filteredPresets = PRINT_PRESETS.filter(p => p.category === activeCategory);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const wIn = convertToInches(customWidth, customUnit);
    const hIn = convertToInches(customHeight, customUnit);

    if (wIn <= 0 || hIn <= 0) return;

    const customPreset = {
      id: `custom_${Date.now()}`,
      name: `${customWidth} × ${customHeight} ${customUnit}`,
      category: PRINT_CATEGORIES.CUSTOM,
      widthInches: wIn,
      heightInches: hIn,
      unit: customUnit,
      customW: customWidth,
      customH: customHeight
    };

    onSelectPreset(customPreset);
  };

  return (
    <div className="preset-selector-card">
      <div className="category-tabs">
        {Object.values(PRINT_CATEGORIES).map((cat) => (
          <button
            key={cat}
            className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {activeCategory !== PRINT_CATEGORIES.CUSTOM ? (
        <div className="presets-grid">
          {filteredPresets.map((preset) => {
            const isSelected = activePreset?.id === preset.id;
            const required = getRequiredPixels(preset.widthInches, preset.heightInches, dpi);

            return (
              <button
                key={preset.id}
                className={`preset-chip ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectPreset(preset)}
              >
                <div className="preset-chip-top">
                  <span className="preset-name">{preset.name}</span>
                  {isSelected && <Check size={14} className="text-accent" />}
                </div>
                <div className="preset-chip-details">
                  {preset.metricName && <span className="preset-sub">{preset.metricName}</span>}
                  <span className="preset-pixels">{required.width} × {required.height} px</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <form className="custom-size-form" onSubmit={handleCustomSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Width</label>
              <input
                type="number"
                step="any"
                min="0.5"
                max="200"
                value={customWidth}
                onChange={(e) => setCustomWidth(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Height</label>
              <input
                type="number"
                step="any"
                min="0.5"
                max="200"
                value={customHeight}
                onChange={(e) => setCustomHeight(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Unit</label>
              <select
                value={customUnit}
                onChange={(e) => setCustomUnit(e.target.value)}
                className="select-field"
              >
                <option value="in">Inches (in)</option>
                <option value="cm">Centimeters (cm)</option>
                <option value="mm">Millimeters (mm)</option>
              </select>
            </div>
          </div>

          <div className="custom-preview-calc">
            {(() => {
              const wIn = convertToInches(customWidth, customUnit);
              const hIn = convertToInches(customHeight, customUnit);
              const req = getRequiredPixels(wIn, hIn, dpi);
              return (
                <span>Required Resolution at {dpi} PPI: <strong>{req.width} × {req.height} pixels</strong></span>
              );
            })()}
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2">
            <Plus size={16} />
            <span>Apply Custom Print Size</span>
          </button>
        </form>
      )}
    </div>
  );
}
