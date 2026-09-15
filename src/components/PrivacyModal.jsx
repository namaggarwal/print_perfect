import React from 'react';
import { X, ShieldCheck, Lock, HardDrive, Cpu, CheckCircle2, ServerOff } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content privacy-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <ShieldCheck className="text-emerald" size={22} />
            <h3>Privacy & Local Processing</h3>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="privacy-modal-body">
          <div className="privacy-hero-banner">
            <Lock size={28} className="text-emerald" />
            <div className="hero-text">
              <h4>Your photos never leave your device.</h4>
              <p>Everything is calculated, cropped, enhanced, and exported 100% inside your web browser.</p>
            </div>
          </div>

          <div className="privacy-features-grid">
            <div className="privacy-feature-card">
              <ServerOff size={20} className="feature-icon text-accent" />
              <div className="feature-content">
                <h5>Zero Server Uploads</h5>
                <p>We operate no backend processing servers for your images. Your photo files are read into client RAM only.</p>
              </div>
            </div>

            <div className="privacy-feature-card">
              <Cpu size={20} className="feature-icon text-emerald" />
              <div className="feature-content">
                <h5>Browser GPU Execution</h5>
                <p>Smart cropping, color tuning, and Lanczos upscaling utilize your local CPU & WebGL graphics capabilities.</p>
              </div>
            </div>

            <div className="privacy-feature-card">
              <HardDrive size={20} className="feature-icon text-amber" />
              <div className="feature-content">
                <h5>Local IndexedDB Drafts</h5>
                <p>Saved project drafts exist solely within your web browser's local sandbox storage and can be wiped anytime.</p>
              </div>
            </div>

            <div className="privacy-feature-card">
              <CheckCircle2 size={20} className="feature-icon text-purple" />
              <div className="feature-content">
                <h5>No Account Required</h5>
                <p>No registration, email input, or cloud tracking needed to prepare high-resolution print files.</p>
              </div>
            </div>
          </div>

          <div className="privacy-tech-details">
            <h5>Technical Privacy Summary</h5>
            <ul>
              <li><strong>Framework:</strong> Progressive Web App (PWA) client engine.</li>
              <li><strong>Storage:</strong> HTML5 File API & IndexedDB Browser Storage.</li>
              <li><strong>Network:</strong> Standard HTTP GET for app assets only. No image data sent in POST/PUT payloads.</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary w-full" onClick={onClose}>
            Got it, return to editor
          </button>
        </div>
      </div>
    </div>
  );
}
