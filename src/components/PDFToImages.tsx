import React, { useState } from 'react';
import { downloadImage, getPDFPages } from '../utils/pdfUtils';
import './FeaturePanel.css';

interface ConvertProps {
  onComplete?: () => void;
}

export const PDFToImages: React.FC<ConvertProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setImages([]);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      alert('Please select a PDF');
      return;
    }

    setLoading(true);
    try {
      const pageImages = await getPDFPages(file);
      setImages(pageImages);
    } catch (error) {
      alert('Error converting PDF: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    images.forEach((img, idx) => {
      downloadImage(img, `page-${idx + 1}.png`);
    });
  };

  return (
    <div className="feature-panel">
      <h3>🖼️ Convert PDF to Images</h3>
      <div className="file-input-wrapper">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          disabled={loading}
        />
      </div>

      <div className="button-group">
        <button onClick={handleConvert} disabled={loading || !file} className="action-btn">
          {loading ? 'Converting...' : 'Convert to Images'}
        </button>
        {images.length > 0 && (
          <button onClick={handleDownloadAll} className="action-btn save-btn">
            Download All ({images.length})
          </button>
        )}
      </div>

      {images.length > 0 && (
        <div className="image-gallery">
          {images.map((img, idx) => (
            <div key={idx} className="image-item">
              <img src={img} alt={`Page ${idx + 1}`} />
              <div className="image-actions">
                <button
                  onClick={() => downloadImage(img, `page-${idx + 1}.png`)}
                  className="download-btn"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
