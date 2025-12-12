# 📄 PDF Toolkit

A comprehensive, browser-based PDF manipulation tool that allows you to combine, split, trim, edit, and convert PDFs - all without sending any files to a server.

## Features

- **📎 Combine PDFs** - Merge multiple PDF files into a single document
- **✂️ Split PDFs** - Extract specific pages from a PDF into a new document
- **📏 Trim PDFs** - Keep only a range of pages from a PDF
- **🖼️ Convert to Images** - Convert PDF pages to PNG images for easy sharing and viewing
- **✏️ Edit & Draw** - Draw on PDFs with a pen tool, highlight text, add text annotations, and create signatures
- **🔒 Privacy First** - All processing happens locally in your browser; no files are uploaded to servers

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd /home/jake/Downloads/pdf\ frontend
```

2. Install dependencies (already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173/`

## Build for Production

To create an optimized production build:

```bash
npm run build
```

The compiled files will be in the `dist/` directory.

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **pdf-lib** - PDF manipulation (creating, modifying PDFs)
- **pdfjs-dist** - PDF rendering and viewing
- **Fabric.js** - Canvas drawing and manipulation

## Project Structure

```
src/
├── components/          # React components for each feature
│   ├── CombinePDFs.tsx
│   ├── SplitPDF.tsx
│   ├── TrimPDF.tsx
│   ├── PDFToImages.tsx
│   ├── EditPDF.tsx
│   ├── PDFDrawingCanvas.tsx
│   └── *.css           # Component styles
├── utils/
│   └── pdfUtils.ts     # PDF manipulation utilities
├── types/
│   └── index.ts        # TypeScript type definitions
├── App.tsx             # Main application component
├── App.css             # Application styles
└── main.tsx            # Entry point
```

## Usage

### Combine PDFs
1. Click "Combine" in the sidebar
2. Select multiple PDF files
3. Click "Combine PDFs" to merge them
4. Download the combined PDF

### Split PDF
1. Click "Split" in the sidebar
2. Select a PDF file
3. Enter page numbers to extract (e.g., 1,3,5)
4. Click "Split PDF"
5. Download the new PDF with selected pages

### Trim PDF
1. Click "Trim" in the sidebar
2. Select a PDF file
3. Set the first and last page numbers
4. Click "Trim PDF"
5. Download the trimmed PDF

### Convert to Images
1. Click "Convert to Images" in the sidebar
2. Select a PDF file
3. Click "Convert to Images"
4. Download individual pages or all pages at once

### Edit & Draw
1. Click "Edit & Draw" in the sidebar
2. Select a PDF file
3. Use the toolbar to:
   - ✏️ Draw with pen tool
   - 🖍️ Highlight areas
   - 📝 Add text annotations
   - ✍️ Add signatures
4. Navigate between pages with Previous/Next buttons
5. Click "Save" to save your edits to that page
6. Click "Export PDF" when done

### Tools in Drawing Mode
- **Color Picker** - Select any color for your drawing
- **Size Slider** - Adjust brush/text size (1-20)
- **Clear** - Clear all annotations from current page
- **Save** - Save the current page's annotations

## Features in Detail

### Local Processing
All PDF operations are processed entirely in your browser using JavaScript. No files are sent to external servers, ensuring complete privacy of your documents.

### Multiple Input Formats
Supports standard PDF files. Output includes PDF and PNG formats depending on the operation.

### Responsive Design
The interface works on desktop, tablet, and mobile devices with a responsive layout.

## Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Requires a browser with:
- Canvas API support
- File API support
- Web Workers support (for pdf.js)

## Limitations

- **Large PDFs**: Performance may vary with very large PDF files (100+ MB) due to browser memory limitations.
- **Complex PDFs**: Some PDFs with complex layouts or embedded fonts may not render perfectly.
- **Drawing Quality**: The drawing tool renders at screen resolution; for print-quality documents, you may want to work with higher-resolution displays.

## Performance Tips

1. **Close Other Applications** - Free up RAM for better performance with large PDFs
2. **Use Modern Browser** - Latest versions have better PDF.js performance
3. **Batch Operations** - Combine multiple operations on the same PDF in one session

## Troubleshooting

### PDF Won't Load
- Check that the file is a valid PDF
- Try a different browser
- Clear browser cache and reload

### Drawing Tools Not Working
- Ensure JavaScript is enabled
- Try refreshing the page
- Check browser console for errors

### File Download Issues
- Check popup blocker settings
- Try a different browser
- Ensure sufficient disk space

## Future Enhancements

- OCR (Optical Character Recognition) for scanned PDFs
- PDF form filling
- Watermark addition
- PDF encryption/password protection
- Batch processing for multiple files
- Undo/Redo for drawing operations
- More drawing tools (shapes, arrows, etc.)

## License

This project is open source and available for personal and commercial use.

## Support

For issues or feature requests, please check the browser console for error messages and ensure you're using a modern, up-to-date browser.

---

**Note**: All processing happens locally. No data is stored on servers. Your documents remain private and secure.

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
## Help:
- This helped me troubleshoot issues with deployment: https://github.com/orgs/community/discussions/61532