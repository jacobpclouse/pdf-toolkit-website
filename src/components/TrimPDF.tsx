import React, { useState } from 'react';
import { trimPDF, downloadFile, getPDFPages } from '../utils/pdfUtils';
import './FeaturePanel.css';

interface TrimProps {
  onComplete?: () => void;
}

export const TrimPDF: React.FC<TrimProps> = ({ onComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [firstPage, setFirstPage] = useState<string>('1');
  const [lastPage, setLastPage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [pages, setPages] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setLoading(true);
      try {
        const pageUrls = await getPDFPages(selectedFile);
        setPages(pageUrls);
        setTotalPages(pageUrls.length);
        setLastPage(pageUrls.length.toString());
      } catch (error) {
        alert('Error loading PDF: ' + error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTrim = async () => {
    if (!file || !firstPage || !lastPage) {
      alert('Please select a PDF and enter page range');
      return;
    }

    const first = parseInt(firstPage);
    const last = parseInt(lastPage);

    if (isNaN(first) || isNaN(last) || first < 1 || last > totalPages || first > last) {
      alert(`Please enter valid page range (1-${totalPages})`);
      return;
    }

    setLoading(true);
    try {
      const result = await trimPDF(file, first, last);
      downloadFile(result, 'trimmed.pdf');
      setFile(null);
      setFirstPage('1');
      setLastPage('');
      setPreview(false);
      setPages([]);
      onComplete?.();
    } catch (error) {
      alert('Error trimming PDF: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feature-panel">
      <h3>📏 Trim PDF</h3>
      <div className="file-input-wrapper">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          disabled={loading}
        />
      </div>

      {file && (
        <div className="trim-controls">
          <div className="input-group">
            <label>From page:</label>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={firstPage}
              onChange={(e) => setFirstPage(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <label>To page:</label>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={lastPage}
              onChange={(e) => setLastPage(e.target.value)}
              disabled={loading}
            />
          </div>
          <p className="info-text">Total pages: {totalPages}</p>
        </div>
      )}

      <button onClick={handleTrim} disabled={loading || !file} className="action-btn">
        {loading ? 'Trimming...' : 'Trim PDF'}
      </button>

      {!preview && file && pages.length > 0 && (
        <button
          onClick={() => setPreview(true)}
          className="action-btn secondary"
          disabled={loading}
        >
          Show Preview
        </button>
      )}

      {preview && (
        <div className="preview-grid">
          {pages.map((page, idx) => (
            <div key={idx} className="preview-item">
              <img src={page} alt={`Page ${idx + 1}`} />
              <p>Page {idx + 1}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
