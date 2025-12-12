import React, { useState } from 'react';
import { combinePDFs, downloadFile } from '../utils/pdfUtils';
import './FeaturePanel.css';

interface CombineProps {
  onComplete?: () => void;
}

export const CombinePDFs: React.FC<CombineProps> = ({ onComplete }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
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
      <h3>📎 Combine PDFs</h3>
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
          <div key={idx} className="file-item">
            {file.name}
            <button
              onClick={() => setFiles(files.filter((_, i) => i !== idx))}
              className="remove-btn"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleCombine} disabled={loading} className="action-btn">
        {loading ? 'Combining...' : 'Combine PDFs'}
      </button>
    </div>
  );
};
