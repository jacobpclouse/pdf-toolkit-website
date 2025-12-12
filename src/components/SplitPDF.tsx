import React, { useState } from 'react';
import { splitPDF, downloadFile, getPDFPages } from '../utils/pdfUtils';
import './FeaturePanel.css';

interface SplitProps {
  onComplete?: () => void;
}

export const SplitPDF: React.FC<SplitProps> = ({ onComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [pageNumbers, setPageNumbers] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [pages, setPages] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageError, setPageError] = useState<string>('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(false);
      setPageError('');
      setLoading(true);
      try {
        const pageUrls = await getPDFPages(selectedFile);
        setPages(pageUrls);
        setTotalPages(pageUrls.length);
      } catch (error) {
        alert('Error loading PDF: ' + error);
      } finally {
        setLoading(false);
      }
    }
  };

  const validatePages = (input: string): { valid: boolean; pages: number[] } => {
    const pages = input
      .split(',')
      .map((p) => parseInt(p.trim()))
      .filter((p) => !isNaN(p));

    if (pages.length === 0) {
      setPageError('Please enter at least one page number');
      return { valid: false, pages: [] };
    }

    const invalidPages = pages.filter((p) => p < 1 || p > totalPages);
    if (invalidPages.length > 0) {
      setPageError(
        `Invalid page numbers: ${invalidPages.join(', ')}. Valid range: 1-${totalPages}`
      );
      return { valid: false, pages: [] };
    }

    setPageError('');
    return { valid: true, pages };
  };

  const handlePageNumbersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPageNumbers(value);
    if (value.trim()) {
      validatePages(value);
    } else {
      setPageError('');
    }
  };

  const handlePreview = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const pageUrls = await getPDFPages(file);
      setPages(pageUrls);
      setPreview(true);
    } catch (error) {
      alert('Error loading PDF: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleSplit = async () => {
    if (!file || !pageNumbers.trim()) {
      alert('Please select a PDF and enter page numbers');
      return;
    }

    const { valid, pages: selectedPages } = validatePages(pageNumbers);

    if (!valid) {
      return;
    }

    setLoading(true);
    try {
      const result = await splitPDF(file, selectedPages);
      downloadFile(result, 'split.pdf');
      setFile(null);
      setPageNumbers('');
      setPreview(false);
      setPages([]);
      setPageError('');
      setTotalPages(0);
      onComplete?.();
    } catch (error) {
      alert('Error splitting PDF: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feature-panel">
      <h3>✂️ Split PDF</h3>
      <div className="file-input-wrapper">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          disabled={loading}
        />
      </div>

      {file && (
        <div className="input-group">
          <label>Enter page numbers to extract (e.g., 1,3,5)</label>
          <input
            type="text"
            value={pageNumbers}
            onChange={handlePageNumbersChange}
            placeholder="1,2,3"
            disabled={loading}
          />
          {pageError && <div style={{ color: '#ff006e', fontSize: '12px', marginTop: '5px', fontWeight: '600' }}>{pageError}</div>}
          <div className="info-text">Total pages: {totalPages}</div>
        </div>
      )}

      <div className="button-group">
        {file && (
          <button onClick={handlePreview} disabled={loading} className="action-btn">
            {loading ? 'Loading...' : 'Preview Pages'}
          </button>
        )}
        <button
          onClick={handleSplit}
          disabled={loading || !file || !pageNumbers.trim() || pageError !== ''}
          className="action-btn save-btn"
        >
          {loading ? 'Splitting...' : 'Split PDF'}
        </button>
      </div>

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
