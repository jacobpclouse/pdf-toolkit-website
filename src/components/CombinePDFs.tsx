import React, { useState } from 'react';
import { combinePDFs, downloadFile, getPDFPages } from '../utils/pdfUtils';
import './FeaturePanel.css';

interface CombineProps {
  onComplete?: () => void;
}

export const CombinePDFs: React.FC<CombineProps> = ({ onComplete }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [preview, setPreview] = useState(false);
  const [previewPages, setPreviewPages] = useState<Map<number, string[]>>(new Map());

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(newFiles);
      setPreviewPages(new Map());
      setPreview(false);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    const newFiles = [...files];
    const draggedFile = newFiles[draggedIndex];
    newFiles.splice(draggedIndex, 1);
    newFiles.splice(targetIndex, 0, draggedFile);
    setFiles(newFiles);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handlePreview = async () => {
    setLoading(true);
    const newPreviewPages = new Map<number, string[]>();
    
    try {
      for (let i = 0; i < files.length; i++) {
        const pages = await getPDFPages(files[i]);
        newPreviewPages.set(i, pages);
      }
      setPreviewPages(newPreviewPages);
      setPreview(true);
    } catch (error) {
      alert('Error loading PDF previews: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleCombine = async () => {
    if (files.length < 2) {
      alert('Please select at least 2 PDF files');
      return;
    }

    setLoading(true);
    try {
      const result = await combinePDFs(files);
      downloadFile(result, 'combined.pdf');
      setFiles([]);
      onComplete?.();
    } catch (error) {
      alert('Error combining PDFs: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feature-panel">
      <div className="panel-header">
        <h3>📎 Combine PDFs</h3>
        <button onClick={onComplete} className="home-btn" title="Back to home">
          🏠
        </button>
      </div>
      {!preview ? (
        <>
          <div className="file-input-wrapper">
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileSelect}
              disabled={loading}
            />
          </div>
          <div className="file-list">
            {files.map((file, idx) => (
              <div
                key={idx}
                className={`file-item ${draggedIndex === idx ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
              >
                <span className="drag-handle">⋮⋮</span>
                <span className="file-name">{file.name}</span>
                <button
                  onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                  className="remove-btn"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="button-group">
            <button
              onClick={handlePreview}
              disabled={loading || files.length === 0}
              className="action-btn secondary"
            >
              {loading ? 'Loading...' : '👁️ Preview'}
            </button>
            <button onClick={handleCombine} disabled={loading || files.length < 2} className="action-btn">
              {loading ? 'Combining...' : 'Combine PDFs'}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="preview-container">
            <button
              onClick={() => setPreview(false)}
              className="action-btn secondary"
              style={{ marginBottom: '15px' }}
            >
              ← Back to Edit
            </button>
            <div className="preview-grid">
              {files.map((file, fileIdx) => {
                const pages = previewPages.get(fileIdx) || [];
                return (
                  <div key={fileIdx} className="preview-file-group">
                    <div className="preview-file-name">{file.name}</div>
                    <div className="preview-file-pages">
                      {pages.slice(0, 3).map((page, pageIdx) => (
                        <img
                          key={pageIdx}
                          src={page}
                          alt={`${file.name} - Page ${pageIdx + 1}`}
                          className="preview-item-img"
                        />
                      ))}
                      {pages.length > 3 && (
                        <div className="preview-more">
                          +{pages.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setPreview(false)}
              className="action-btn secondary"
              style={{ marginTop: '15px' }}
            >
              ← Back to Edit
            </button>
          </div>
        </>
      )}
    </div>
  );
};
