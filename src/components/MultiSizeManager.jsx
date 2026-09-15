import React from 'react';
import { Plus, Trash2, Layers, Download, Check } from 'lucide-react';
import { PRINT_PRESETS } from '../constants/printPresets';

export default function MultiSizeManager({
  versions,
  activeVersionId,
  onSelectVersion,
  onAddVersion,
  onDeleteVersion,
  onDownloadAllZip
}) {
  return (
    <div className="multi-size-bar">
      <div className="multi-size-header">
        <div className="multi-size-title">
          <Layers size={16} className="text-accent" />
          <span>Print Versions ({versions.length})</span>
        </div>

        {versions.length > 1 && (
          <button className="btn btn-secondary btn-sm" onClick={onDownloadAllZip}>
            <Download size={14} />
            <span>Download All Sizes (ZIP)</span>
          </button>
        )}
      </div>

      <div className="version-tabs-scroll">
        {versions.map((ver) => {
          const isActive = ver.id === activeVersionId;
          return (
            <div
              key={ver.id}
              className={`version-tab ${isActive ? 'active' : ''}`}
              onClick={() => onSelectVersion(ver.id)}
            >
              <span className="version-name">{ver.name}</span>
              {isActive && <Check size={14} className="text-accent ml-1" />}

              {versions.length > 1 && (
                <button
                  className="version-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteVersion(ver.id);
                  }}
                  title="Remove size version"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          );
        })}

        <button className="version-add-btn" onClick={onAddVersion} title="Add another print size">
          <Plus size={14} />
          <span>Add Another Size</span>
        </button>
      </div>
    </div>
  );
}
