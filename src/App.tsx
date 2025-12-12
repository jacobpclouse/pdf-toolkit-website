import { useState } from 'react';
import './App.css';
import { CombinePDFs } from './components/CombinePDFs';
import { SplitPDF } from './components/SplitPDF';
import { TrimPDF } from './components/TrimPDF';
import { PDFToImages } from './components/PDFToImages';
import { EditPDF } from './components/EditPDF';

type FeatureType = 'combine' | 'split' | 'trim' | 'convert' | 'edit' | null;

function App() {
  const [activeFeature, setActiveFeature] = useState<FeatureType>(null);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>📄 PDF Toolkit</h1>
          <p>Combine, split, edit, and convert PDFs all in your browser</p>
        </div>
      </header>

      <div className="app-content">
        <aside className="sidebar">
          <nav className="feature-nav">
            <h2>Features</h2>
            <button
              className={`nav-btn ${activeFeature === 'combine' ? 'active' : ''}`}
              onClick={() => setActiveFeature('combine')}
            >
              📎 Combine
            </button>
            <button
              className={`nav-btn ${activeFeature === 'split' ? 'active' : ''}`}
              onClick={() => setActiveFeature('split')}
            >
              ✂️ Split
            </button>
            <button
              className={`nav-btn ${activeFeature === 'trim' ? 'active' : ''}`}
              onClick={() => setActiveFeature('trim')}
            >
              📏 Trim
            </button>
            <button
              className={`nav-btn ${activeFeature === 'convert' ? 'active' : ''}`}
              onClick={() => setActiveFeature('convert')}
            >
              🖼️ Convert to Images
            </button>
            <button
              className={`nav-btn ${activeFeature === 'edit' ? 'active' : ''}`}
              onClick={() => setActiveFeature('edit')}
            >
              ✏️ Edit & Draw
            </button>
          </nav>
        </aside>

        <main className="main-content">
          {activeFeature === null && (
            <div className="welcome-section">
              <h2>Welcome to PDF Toolkit!</h2>
              <p>Select a feature from the sidebar to get started.</p>
              <div className="feature-overview">
                <div className="overview-card">
                  <h3>📎 Combine</h3>
                  <p>Merge multiple PDF files into one</p>
                </div>
                <div className="overview-card">
                  <h3>✂️ Split</h3>
                  <p>Extract specific pages from a PDF</p>
                </div>
                <div className="overview-card">
                  <h3>📏 Trim</h3>
                  <p>Keep only a range of pages</p>
                </div>
                <div className="overview-card">
                  <h3>🖼️ Convert</h3>
                  <p>Convert PDF pages to PNG images</p>
                </div>
                <div className="overview-card">
                  <h3>✏️ Edit & Draw</h3>
                  <p>Draw, highlight, add text and signatures</p>
                </div>
              </div>
            </div>
          )}

          {activeFeature === 'combine' && (
            <CombinePDFs onComplete={() => setActiveFeature(null)} />
          )}

          {activeFeature === 'split' && (
            <SplitPDF onComplete={() => setActiveFeature(null)} />
          )}

          {activeFeature === 'trim' && (
            <TrimPDF onComplete={() => setActiveFeature(null)} />
          )}

          {activeFeature === 'convert' && (
            <PDFToImages onComplete={() => setActiveFeature(null)} />
          )}

          {activeFeature === 'edit' && (
            <EditPDF onComplete={() => setActiveFeature(null)} />
          )}
        </main>
      </div>

      <footer className="app-footer">
        <p>All processing is done locally in your browser • No files are uploaded</p>
      </footer>
    </div>
  );
}

export default App
