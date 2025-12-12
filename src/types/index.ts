export interface PDFFile {
  name: string;
  file: File;
  pages?: number;
}

export interface DrawingTool {
  type: 'pen' | 'highlight' | 'text' | 'signature';
  color: string;
  size: number;
}

export interface PDFPage {
  pageNum: number;
  url?: string;
}
