import React from 'react';
import { Info, Maximize2, FileText, HardDrive, Cpu, Award } from 'lucide-react';
import { estimateMegapixels, formatFileSize } from '../utils/printUtils';

export default function ImageAnalysisCard({ imageData }) {
  if (!imageData || !imageData.imgElement) return null;

  const w = imageData.imgElement.naturalWidth;
  const h = imageData.imgElement.naturalHeight;
  const mp = estimateMegapixels(w, h);
  const aspect = (w / h).toFixed(2);
  const ext = imageData.fileName ? imageData.fileName.split('.').pop().toUpperCase() : 'IMG';

  // Estimate maximum print size at 300 DPI
  const maxInW = (w / 300).toFixed(1);
  const maxInH = (h / 300).toFixed(1);

  return (
    <div className="analysis-card">
      <div className="analysis-header">
        <Info size={16} className="text-accent" />
        <span className="analysis-title">Source Photo Analysis</span>
      </div>

      <div className="analysis-grid">
        <div className="analysis-item">
          <Maximize2 size={15} className="analysis-icon" />
          <div className="analysis-detail">
            <span className="analysis-label">Resolution</span>
            <span className="analysis-val">{w} × {h} px</span>
          </div>
        </div>

        <div className="analysis-item">
          <Cpu size={15} className="analysis-icon" />
          <div className="analysis-detail">
            <span className="analysis-label">Megapixels</span>
            <span className="analysis-val">{mp} MP</span>
          </div>
        </div>

        <div className="analysis-item">
          <FileText size={15} className="analysis-icon" />
          <div className="analysis-detail">
            <span className="analysis-label">Aspect / Type</span>
            <span className="analysis-val">{aspect}:1 ({ext})</span>
          </div>
        </div>

        <div className="analysis-item">
          <HardDrive size={15} className="analysis-icon" />
          <div className="analysis-detail">
            <span className="analysis-label">File Size</span>
            <span className="analysis-val">{formatFileSize(imageData.fileSize)}</span>
          </div>
        </div>

        <div className="analysis-item full-width">
          <Award size={15} className="analysis-icon text-emerald" />
          <div className="analysis-detail">
            <span className="analysis-label">Max Print at 300 PPI</span>
            <span className="analysis-val text-emerald">Up to {maxInW} × {maxInH} inches without loss</span>
          </div>
        </div>
      </div>
    </div>
  );
}
