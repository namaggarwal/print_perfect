import React, { useState, useEffect } from 'react';
import { X, History, Trash2, FolderOpen, Calendar, HardDrive } from 'lucide-react';
import { getRecentProjects, deleteProject, clearAllProjects } from '../utils/db';

export default function RecentProjects({ isOpen, onClose, onLoadProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await getRecentProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (confirm('Delete this saved project from your local browser storage?')) {
      await deleteProject(id);
      loadData();
    }
  };

  const handleClearAll = async () => {
    if (confirm('Delete all saved local projects? This cannot be undone.')) {
      await clearAllProjects();
      loadData();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-group">
            <History className="text-accent" size={20} />
            <h3>Recent Local Projects</h3>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="drawer-body">
          <p className="drawer-notice">
            Saved locally in your browser storage. Deleting browser cache will erase saved project drafts.
          </p>

          {loading ? (
            <div className="loading-spinner-box">Loading saved projects...</div>
          ) : projects.length === 0 ? (
            <div className="empty-projects-box">
              <FolderOpen size={36} className="text-subtle mb-2" />
              <p>No saved local projects found.</p>
            </div>
          ) : (
            <div className="projects-list">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="project-card"
                  onClick={() => {
                    onLoadProject(proj);
                    onClose();
                  }}
                >
                  {proj.thumbnail && (
                    <img src={proj.thumbnail} alt={proj.fileName} className="project-thumb" />
                  )}
                  <div className="project-info">
                    <span className="project-name">{proj.fileName}</span>
                    <span className="project-sub font-mono">
                      {proj.versions ? `${proj.versions.length} print sizes` : proj.presetName}
                    </span>
                    <span className="project-date">
                      <Calendar size={12} className="inline mr-1" />
                      {new Date(proj.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    className="icon-btn text-error hover:bg-error/20 ml-auto"
                    onClick={(e) => handleDelete(proj.id, e)}
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {projects.length > 0 && (
          <div className="drawer-footer">
            <button className="btn btn-ghost text-error w-full" onClick={handleClearAll}>
              <Trash2 size={16} />
              <span>Clear All Saved Projects</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
