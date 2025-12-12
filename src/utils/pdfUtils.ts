import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb } from 'pdf-lib';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min?url';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function getPDFPages(file: File): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) throw new Error('Canvas context not available');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport,
      canvas,
    } as any).promise;

    pages.push(canvas.toDataURL('image/png'));
  }

  return pages;
}

export async function combinePDFs(files: File[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const buffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(buffer);
    const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => pdfDoc.addPage(page));
  }

  return pdfDoc.save();
}

export async function splitPDF(file: File, pageNumbers: number[]): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer);
  const newPdf = await PDFDocument.create();

  for (const pageNum of pageNumbers) {
    const [page] = await newPdf.copyPages(pdf, [pageNum - 1]);
    newPdf.addPage(page);
  }

  return newPdf.save();
}

export async function trimPDF(file: File, firstPage: number, lastPage: number): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer);
  const pageIndices = Array.from(
    { length: lastPage - firstPage + 1 },
    (_, i) => firstPage - 1 + i
  );

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(pdf, pageIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return newPdf.save();
}

export async function pdfToImages(file: File): Promise<string[]> {
  return getPDFPages(file);
}

export async function addTextToPDF(
  file: File,
  pageNum: number,
  text: string,
  x: number,
  y: number
): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer);
  const page = pdf.getPage(pageNum - 1);

  page.drawText(text, {
    x,
    y,
    size: 12,
    color: rgb(0, 0, 0),
  });

  return pdf.save();
}

export async function embedDrawingInPDF(
  file: File,
  pageNum: number,
  drawingImageUrl: string
): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(buffer);
  const page = pdf.getPage(pageNum - 1);

  // Convert data URL to bytes
  const response = await fetch(drawingImageUrl);
  const imageBytes = await response.arrayBuffer();

  // Embed the image on top of the page
  const image = await pdf.embedPng(imageBytes);
  const { width, height } = page.getSize();

  // Draw the image at full page size to preserve drawings
  page.drawImage(image, {
    x: 0,
    y: 0,
    width,
    height,
  });

  return pdf.save();
}

export async function embedMultipleDrawings(
  file: File,
  drawings: Array<{ pageNum: number; imageUrl: string }>
): Promise<Uint8Array> {
  let buffer: any = await file.arrayBuffer();

  // Process each drawing in order
  for (const drawing of drawings) {
    const result = await embedDrawingInPDF(
      new File([buffer], 'temp.pdf', { type: 'application/pdf' }),
      drawing.pageNum,
      drawing.imageUrl
    );
    buffer = result.buffer;
  }

  return new Uint8Array(buffer);
}

export function downloadFile(buffer: Uint8Array | ArrayBuffer, filename: string): void {
  const blob = new Blob([new Uint8Array(buffer as ArrayBuffer)], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export function downloadImage(dataUrl: string, filename: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
