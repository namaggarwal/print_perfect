import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Lock, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { SAMPLE_PHOTOS } from '../constants/sampleImages';

export default function UploadZone({ onImageLoaded, onOpenPrivacy }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isConvertingHeic, setIsConvertingHeic] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);

  const processImageFile = async (file) => {
    if (!file) return;

    setErrorMsg(null);
    const fileNameLower = file.name.toLowerCase();
    const isHeic = fileNameLower.endsWith('.heic') || fileNameLower.endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif';

    let targetFile = file;

    if (isHeic) {
      setIsConvertingHeic(true);
      try {
        // Dynamically load client-side HEIC decoder library
        const heic2anyModule = await import('heic2any');
        const heic2any = heic2anyModule.default || heic2anyModule;

        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.92
        });

        const resultBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        targetFile = new File([resultBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' });
      } catch (err) {
        console.error('HEIC conversion error', err);
        setErrorMsg('Could not convert HEIC photo locally. Please ensure the file is a valid HEIC/HEIF photo.');
        setIsConvertingHeic(false);
        return;
      } finally {
        setIsConvertingHeic(false);
      }
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        onImageLoaded({
          imgElement: img,
          fileName: targetFile.name,
          fileSize: targetFile.size,
          fileType: targetFile.type || 'image/jpeg',
          src: e.target.result
        });
      };
      img.onerror = () => {
        setErrorMsg('Could not read image file. It may be corrupted or unsupported.');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(targetFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSampleClick = (sample) => {
    setLoadingSample(true);
    setTimeout(() => {
      const dataUri = sample.getType();
      const img = new Image();
      img.onload = () => {
        onImageLoaded({
          imgElement: img,
          fileName: `${sample.id}.jpg`,
          fileSize: 4500000,
          fileType: 'image/jpeg',
          src: dataUri
        });
        setLoadingSample(false);
      };
      img.src = dataUri;
    }, 50);
  };

  return (
    <div className="upload-container">
      <div
        className={`upload-card ${isDragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isConvertingHeic && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && processImageFile(e.target.files[0])}
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
          style={{ display: 'none' }}
        />

        <div className="upload-icon-wrapper">
          {isConvertingHeic ? (
            <RefreshCw className="upload-icon animate-spin text-cyan" />
          ) : (
            <UploadCloud className="upload-icon" />
          )}
        </div>

        {isConvertingHeic ? (
          <>
            <h2 className="upload-title">Converting iPhone HEIC Photo...</h2>
            <p className="upload-subtitle">Decoding HEIC image 100% locally in your browser RAM</p>
          </>
        ) : (
          <>
            <h2 className="upload-title">Drop your photo here, or browse</h2>
            <p className="upload-subtitle">Supports high-res JPG, PNG, WebP & iPhone HEIC/HEIF files</p>

            <button
              className="btn btn-primary btn-lg mt-4"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            >
              <ImageIcon size={20} />
              <span>Choose Photo</span>
            </button>
          </>
        )}

        <div className="privacy-banner" onClick={(e) => { e.stopPropagation(); onOpenPrivacy(); }}>
          <Lock size={16} className="text-emerald" />
          <span><strong>Your photos stay on your device.</strong> Everything happens in your browser.</span>
        </div>
      </div>

      {errorMsg && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Quick Sample Selector */}
      <div className="samples-section">
        <div className="samples-header">
          <Sparkles size={16} className="text-accent" />
          <span>Or try with a sample 4K photo:</span>
        </div>

        <div className="samples-grid">
          {SAMPLE_PHOTOS.map((sample) => (
            <button
              key={sample.id}
              className="sample-card"
              onClick={() => handleSampleClick(sample)}
              disabled={loadingSample || isConvertingHeic}
            >
              <div className="sample-badge">{sample.aspect}</div>
              <div className="sample-info">
                <span className="sample-title">{sample.title}</span>
                <span className="sample-category">{sample.category}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
