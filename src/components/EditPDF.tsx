import React, { useState } from 'react';
import { getPDFPages, embedMultipleDrawings, downloadFile } from '../utils/pdfUtils';
import { PDFDrawingCanvas } from './PDFDrawingCanvas';
import './FeaturePanel.css';

interface EditProps {
  onComplete?: () => void;
}

export const EditPDF: React.FC<EditProps> = ({ onComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editedPages, setEditedPages] = useState<Record<number, string>>({});

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setLoading(true);
      try {
        const pageUrls = await getPDFPages(selectedFile);
        setPages(pageUrls);
        setCurrentPageIdx(0);
        setEditedPages({});
      } catch (error) {
        alert('Error loading PDF: ' + error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSavePage = (dataUrl: string) => {
    setEditedPages({
      ...editedPages,
      [currentPageIdx]: dataUrl,
    });
    alert('Page saved! Changes are in memory.');
  };

  const handleExport = async () => {
    if (!file || Object.keys(editedPages).length === 0) {
      alert('No changes to export. Edit and save at least one page.');
      return;
    }

    try {
      // Convert edited pages object to array format for embedding
      const drawings = Object.entries(editedPages).map(([pageIdx, imageUrl]) => ({
        pageNum: parseInt(pageIdx) + 1,
        imageUrl,
      }));

      // Embed all drawings into the PDF
      const result = await embedMultipleDrawings(file, drawings);
      downloadFile(result, `edited-${file.name}`);
      
      // Reset state
      setFile(null);
      setPages([]);
      setEditedPages({});
      setCurrentPageIdx(0);
      onComplete?.();
    } catch (error) {
      alert('Error exporting PDF: ' + error);
    }
  };

  return (
    <div className="feature-panel">
      <h3>✏️ Edit PDF</h3>
      <div className="file-input-wrapper">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          disabled={loading}
        />
      </div>

      {pages.length > 0 && (
        <div className="edit-controls">
          <div className="page-navigator">
            <button
              onClick={() => setCurrentPageIdx(Math.max(0, currentPageIdx - 1))}
              disabled={currentPageIdx === 0}
            >
              ◀ Previous
            </button>
            <span>
              Page {currentPageIdx + 1} of {pages.length}
            </span>
            <button
              onClick={() => setCurrentPageIdx(Math.min(pages.length - 1, currentPageIdx + 1))}
              disabled={currentPageIdx === pages.length - 1}
            >
              Next ▶
            </button>
          </div>

          <PDFDrawingCanvas
            imageUrl={pages[currentPageIdx]}
            onSave={handleSavePage}
          />

          <div className="edit-info">
            {editedPages[currentPageIdx] && <span>✓ Page saved</span>}
            <p>{Object.keys(editedPages).length} pages edited</p>
          </div>

          <button onClick={handleExport} className="action-btn save-btn">
            Export PDF
          </button>
        </div>
      )}
    </div>
  );
};
