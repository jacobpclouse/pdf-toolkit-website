import React, { useRef, useEffect, useState } from 'react';
import './PDFDrawingCanvas.css';

interface PDFDrawingCanvasProps {
  imageUrl: string;
  onSave: (dataUrl: string) => void;
}

type DrawingMode = 'pen' | 'highlight' | 'text' | 'signature' | 'none';

export const PDFDrawingCanvas: React.FC<PDFDrawingCanvasProps> = ({ imageUrl, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<DrawingMode>('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPos, setTextPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode === 'text') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setTextPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setShowTextInput(true);
      }
      return;
    }

    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || mode === 'text') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = mode === 'highlight' ? `${color}40` : color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const addText = () => {
    if (!textInput || !textPos) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = color;
    ctx.font = `${lineWidth * 8}px Arial`;
    ctx.fillText(textInput, textPos.x, textPos.y);

    setTextInput('');
    setShowTextInput(false);
    setTextPos(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageUrl;
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div className="drawing-container">
      <div className="drawing-toolbar">
        <div className="tool-group">
          <button
            className={`tool-btn ${mode === 'pen' ? 'active' : ''}`}
            onClick={() => setMode('pen')}
            title="Pen"
          >
            ✏️
          </button>
          <button
            className={`tool-btn ${mode === 'highlight' ? 'active' : ''}`}
            onClick={() => setMode('highlight')}
            title="Highlight"
          >
            🖍️
          </button>
          <button
            className={`tool-btn ${mode === 'text' ? 'active' : ''}`}
            onClick={() => setMode('text')}
            title="Text"
          >
            📝
          </button>
          <button
            className={`tool-btn ${mode === 'signature' ? 'active' : ''}`}
            onClick={() => setMode('signature')}
            title="Signature"
          >
            ✍️
          </button>
        </div>

        <div className="tool-group">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            title="Color"
          />
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="size-slider"
            title="Brush size"
          />
        </div>

        <div className="tool-group">
          <button onClick={clearCanvas} className="action-btn">
            Clear
          </button>
          <button onClick={saveCanvas} className="action-btn save-btn">
            Save
          </button>
        </div>
      </div>

      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="drawing-canvas"
        />
      </div>

      {showTextInput && (
        <div className="text-input-popup" style={{ position: 'absolute' }}>
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter text"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') addText();
            }}
          />
          <button onClick={addText}>Add</button>
          <button onClick={() => setShowTextInput(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};
