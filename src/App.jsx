import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import UploadZone from './components/UploadZone';
import ImageAnalysisCard from './components/ImageAnalysisCard';
import PresetSelector from './components/PresetSelector';
import QualityChecker from './components/QualityChecker';
import CropEditor from './components/CropEditor';
import EnhancePanel from './components/EnhancePanel';
import MarginControls from './components/MarginControls';
import PrintPreviewModal from './components/PrintPreviewModal';
import MultiSizeManager from './components/MultiSizeManager';
import ExportModal from './components/ExportModal';
import PrivacyModal from './components/PrivacyModal';
import RecentProjects from './components/RecentProjects';

import { PRINT_PRESETS } from './constants/printPresets';
import { DEFAULT_ADJUSTMENTS } from './utils/imageEnhancer';
import { upscaleImageCanvas } from './utils/resampler';
import { saveProject } from './utils/db';
import { Eye, Download, Sliders, ShieldCheck } from 'lucide-react';

export default function App() {
  const [imageData, setImageData] = useState(null);
  const [targetDpi, setTargetDpi] = useState(300);

  // Multi-size print versions
  const [versions, setVersions] = useState([]);
  const [activeVersionId, setActiveVersionId] = useState(null);

  // Modals state
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showEnhancePanel, setShowEnhancePanel] = useState(false);

  // When a new image is loaded, initialize 1st version with 8x10 preset
  const handleImageLoaded = (data) => {
    setImageData(data);
    const defaultPreset = PRINT_PRESETS.find(p => p.id === '8x10') || PRINT_PRESETS[0];

    const initialVersion = {
      id: `ver_${Date.now()}`,
      name: defaultPreset.name,
      preset: defaultPreset,
      cropState: {
        zoom: 1,
        panX: 0,
        panY: 0,
        rotation: 0,
        flipH: false,
        flipV: false,
        fitMode: 'fill',
        borderMm: 0,
        borderColor: '#ffffff',
        isLandscape: data.imgElement.naturalWidth > data.imgElement.naturalHeight
      },
      adjustments: { ...DEFAULT_ADJUSTMENTS },
      shouldUpscale: false
    };

    setVersions([initialVersion]);
    setActiveVersionId(initialVersion.id);

    // Save project thumbnail draft into IndexedDB
    try {
      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = 160;
      thumbCanvas.height = 120;
      const ctx = thumbCanvas.getContext('2d');
      ctx.drawImage(data.imgElement, 0, 0, 160, 120);

      saveProject({
        id: `proj_${Date.now()}`,
        fileName: data.fileName,
        thumbnail: thumbCanvas.toDataURL('image/jpeg', 0.7),
        presetName: defaultPreset.name,
        versions: [initialVersion]
      });
    } catch (e) {
      console.warn('Auto save project failed', e);
    }
  };

  const activeVersion = versions.find(v => v.id === activeVersionId) || versions[0];

  // Helper to update active version property
  const updateActiveVersion = (updater) => {
    if (!activeVersionId) return;
    setVersions(prev => prev.map(v => v.id === activeVersionId ? updater(v) : v));
  };

  // Add another print size version
  const handleAddVersion = () => {
    // Pick next preset not yet in versions list or 4x6
    const availablePreset = PRINT_PRESETS.find(p => !versions.some(v => v.preset.id === p.id)) || PRINT_PRESETS[0];
    const newVer = {
      id: `ver_${Date.now()}`,
      name: availablePreset.name,
      preset: availablePreset,
      cropState: { ...activeVersion.cropState },
      adjustments: { ...activeVersion.adjustments },
      shouldUpscale: false
    };
    setVersions(prev => [...prev, newVer]);
    setActiveVersionId(newVer.id);
  };

  const handleDeleteVersion = (id) => {
    if (versions.length <= 1) return;
    const nextVersions = versions.filter(v => v.id !== id);
    setVersions(nextVersions);
    if (activeVersionId === id) {
      setActiveVersionId(nextVersions[0].id);
    }
  };

  const handleSelectPreset = (newPreset) => {
    updateActiveVersion(v => ({
      ...v,
      name: newPreset.name,
      preset: newPreset
    }));
  };

  const handleImproveResolution = () => {
    updateActiveVersion(v => ({ ...v, shouldUpscale: true }));
  };

  const handleResetPhoto = () => {
    if (confirm('Start new photo project? Current photo edits will remain in recent projects.')) {
      setImageData(null);
      setVersions([]);
      setActiveVersionId(null);
    }
  };

  const handleLoadSavedProject = (savedProj) => {
    if (savedProj.versions && savedProj.versions.length > 0) {
      setVersions(savedProj.versions);
      setActiveVersionId(savedProj.versions[0].id);
    }
  };

  return (
    <div className="app-layout">
      <Navbar
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onOpenHistory={() => setShowHistoryDrawer(true)}
        onResetPhoto={handleResetPhoto}
        hasPhoto={!!imageData}
      />

      <main className="app-main-content">
        {!imageData ? (
          <UploadZone
            onImageLoaded={handleImageLoaded}
            onOpenPrivacy={() => setShowPrivacyModal(true)}
          />
        ) : (
          <div className="editor-workspace">
            {/* Top Multi-Size Tab Bar */}
            <MultiSizeManager
              versions={versions}
              activeVersionId={activeVersionId}
              onSelectVersion={setActiveVersionId}
              onAddVersion={handleAddVersion}
              onDeleteVersion={handleDeleteVersion}
              onDownloadAllZip={() => setShowExportModal(true)}
            />

            <div className="workspace-grid">
              {/* Main Center Canvas Crop Stage */}
              <section className="canvas-column">
                {activeVersion && (
                  <CropEditor
                    imageData={imageData}
                    printPreset={activeVersion.preset}
                    cropState={activeVersion.cropState}
                    onChangeCropState={(newCrop) => updateActiveVersion(v => ({ ...v, cropState: newCrop }))}
                    adjustments={activeVersion.adjustments}
                    onOpenEnhance={() => setShowEnhancePanel(!showEnhancePanel)}
                  />
                )}
              </section>

              {/* Right Sidebar Control Panels */}
              <aside className="controls-column">
                <ImageAnalysisCard imageData={imageData} />

                {activeVersion && (
                  <>
                    <QualityChecker
                      imageData={imageData}
                      activePreset={activeVersion.preset}
                      targetDpi={targetDpi}
                      onChangeDpi={setTargetDpi}
                      onImproveResolution={handleImproveResolution}
                      isUpscaled={activeVersion.shouldUpscale}
                    />

                    <PresetSelector
                      activePreset={activeVersion.preset}
                      onSelectPreset={handleSelectPreset}
                      dpi={targetDpi}
                    />

                    {showEnhancePanel && (
                      <EnhancePanel
                        adjustments={activeVersion.adjustments}
                        onChangeAdjustments={(newAdj) => updateActiveVersion(v => ({ ...v, adjustments: newAdj }))}
                        imageData={imageData}
                      />
                    )}

                    <MarginControls
                      cropState={activeVersion.cropState}
                      onChangeCropState={(newCrop) => updateActiveVersion(v => ({ ...v, cropState: newCrop }))}
                    />

                    <div className="action-buttons-group">
                      <button className="btn btn-secondary btn-lg" onClick={() => setShowPreviewModal(true)}>
                        <Eye size={18} />
                        <span>Print Preview</span>
                      </button>

                      <button className="btn btn-primary btn-lg" onClick={() => setShowExportModal(true)}>
                        <Download size={18} />
                        <span>Export Print Image</span>
                      </button>
                    </div>
                  </>
                )}
              </aside>
            </div>
          </div>
        )}
      </main>

      {/* Footer Banner */}
      <footer className="app-footer">
        <div className="footer-content">
          <span>PrintPerfect &copy; 2026 — Browser-Based Photo-to-Print Designer</span>
          <button className="footer-link-btn" onClick={() => setShowPrivacyModal(true)}>
            <ShieldCheck size={14} className="inline mr-1 text-emerald" />
            Photos Stay On Device
          </button>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {imageData && activeVersion && (
        <>
          <PrintPreviewModal
            isOpen={showPreviewModal}
            onClose={() => setShowPreviewModal(false)}
            imageData={imageData}
            activePreset={activeVersion.preset}
            cropState={activeVersion.cropState}
            onChangeCropState={(newCrop) => updateActiveVersion(v => ({ ...v, cropState: newCrop }))}
            adjustments={activeVersion.adjustments}
            targetDpi={targetDpi}
            onSelectPreset={handleSelectPreset}
            onExportClick={() => setShowExportModal(true)}
          />

          <ExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            imageData={imageData}
            activePreset={activeVersion.preset}
            cropState={activeVersion.cropState}
            adjustments={activeVersion.adjustments}
            targetDpi={targetDpi}
            versions={versions}
            isUpscaled={activeVersion.shouldUpscale}
          />
        </>
      )}

      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />

      <RecentProjects
        isOpen={showHistoryDrawer}
        onClose={() => setShowHistoryDrawer(false)}
        onLoadProject={handleLoadSavedProject}
      />
    </div>
  );
}
