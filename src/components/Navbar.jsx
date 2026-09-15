import React, { useState, useEffect } from 'react';
import { ShieldCheck, Download, History, Sparkles, RefreshCw, Printer } from 'lucide-react';

export default function Navbar({ onOpenPrivacy, onOpenHistory, onResetPhoto, hasPhoto }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-logo">
          <Printer className="logo-icon" />
        </div>
        <div className="brand-text">
          <h1 className="brand-title">PrintPerfect</h1>
          <p className="brand-tagline">Resize, crop & prepare photos for physical printing</p>
        </div>
      </div>

      <div className="navbar-actions">
        <button className="privacy-badge-btn" onClick={onOpenPrivacy} title="100% Local Privacy Info">
          <ShieldCheck className="badge-icon" />
          <span>Photos Stay On Your Device</span>
        </button>

        {deferredPrompt && !isInstalled && (
          <button className="btn btn-outline btn-sm" onClick={handleInstallClick}>
            <Download size={16} />
            <span>Install App</span>
          </button>
        )}

        <button className="btn btn-secondary btn-sm" onClick={onOpenHistory} title="View Saved Local Projects">
          <History size={16} />
          <span>Recent Projects</span>
        </button>

        {hasPhoto && (
          <button className="btn btn-primary btn-sm" onClick={onResetPhoto}>
            <RefreshCw size={16} />
            <span>New Photo</span>
          </button>
        )}
      </div>
    </header>
  );
}
