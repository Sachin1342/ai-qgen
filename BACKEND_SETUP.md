# AI-QGen Backend Setup Guide

## Overview
This backend handles:
- **File Upload**: Accepts any file format (PDF, DOCX, TXT, Images, etc.)
- **Text Extraction**: Reads and extracts text from various file formats
- **Keyword Extraction**: Intelligently extracts keywords from extracted text
- **Question Generation**: Generates exam questions based on keywords
- **Export**: Exports questions to PDF and DOCX formats

## Supported File Formats
- **Documents**: PDF, DOCX, DOC, XLSX, CSV
- **Text**: TXT, MD, JSON, XML, HTML, Python, JavaScript, C++, Java
- **Images**: JPG, JPEG, PNG, GIF, BMP, TIFF, WebP (with OCR support)

## Setup Instructions

### 1. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Additional Setup for Image OCR (Optional)
If you want to support image OCR, install Tesseract:

**Windows:**
- Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
- Install to default location or update pytesseract path

**macOS:**
```bash
brew install tesseract
```

**Linux:**
```bash
sudo apt-get install tesseract-ocr
```

### 3. Run the Backend
```bash
python -m app.main
```

Or:
```bash
python backend/app/main.py
```

The backend will start at: **http://127.0.0.1:8001**

## API Endpoints

### 1. Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "ok",
  "message": "AI-QGen backend is running"
}
```

### 2. Upload File
```http
POST /api/upload
Content-Type: multipart/form-data

file: <binary file>
```

**Response:**
```json
{
  "file_id": "uuid",
  "file_name": "document.pdf",
  "keywords": ["keyword1", "keyword2", ...],
  "word_count": 5000,
  "message": "File uploaded and processed successfully"
}
```

### 3. Generate Questions
```http
POST /api/generate
Content-Type: application/json

{
  "keywords": ["keyword1", "keyword2", ...],
  "count": 10,
  "difficulty": "medium",
  "qtype": "mcq"
}
```

**Parameters:**
- `keywords` (required): Array of keywords to base questions on
- `count` (optional): Number of questions (default: 10)
- `difficulty` (optional): easy/medium/hard (default: medium)
- `qtype` (optional): mcq/descriptive (default: mcq)

**Response:**
```json
{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "a) Option A"
    }
  ],
  "count": 10,
  "message": "Questions generated successfully"
}
```

### 4. Export to PDF
```http
POST /api/export/pdf
Content-Type: application/json

{
  "title": "Generated Questions",
  "questions": [...]
}
```

**Response:**
```json
{
  "download_url": "/download/pdf/file-id",
  "file_id": "file-id",
  "message": "PDF exported successfully"
}
```

### 5. Export to DOCX
```http
POST /api/export/docx
Content-Type: application/json

{
  "title": "Generated Questions",
  "questions": [...]
}
```

**Response:**
```json
{
  "download_url": "/download/docx/file-id",
  "file_id": "file-id",
  "message": "DOCX exported successfully"
}
```

## Project Structure
```
backend/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── main.py              # Entry point
│   ├── file_reader.py       # File reading utilities
│   ├── keyword_extractor.py # Keyword extraction logic
│   └── api/
│       ├── __init__.py
│       ├── upload.py        # Upload endpoint
│       ├── generate.py      # Generate endpoint
│       └── export.py        # Export endpoints
├── data/
│   └── uploads/             # Uploaded files storage
├── outputs/                 # Generated files
│   ├── pdf/                 # PDF exports
│   └── docx/                # DOCX exports
└── requirements.txt        # Python dependencies
```

## Features

### Universal File Support
The backend automatically detects file type and uses the appropriate reader:
- PDFs use `pdfplumber` for text extraction
- DOCX uses `python-docx` for document parsing
- Images use OCR (Tesseract + pytesseract) for text recognition
- Text files are read with automatic encoding detection

### Smart Keyword Extraction
- Automatic stop-word filtering
- Frequency-based ranking
- Multi-word keyword support
- Configurable keyword count

### Question Generation
- Template-based generation (can be replaced with AI model)
- Support for MCQ and descriptive questions
- Difficulty levels: easy, medium, hard
- Based on extracted keywords

### Export Formats
- **PDF**: Professional formatted document
- **DOCX**: Microsoft Word compatible format

## Troubleshooting

### FileNotFoundError for Tesseract
If you get an error about Tesseract executable:
1. Install Tesseract (see setup instructions above)
2. On Windows, update path in `file_reader.py`:
   ```python
   pytesseract.pytesseract.pytesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
   ```

### CORS Errors
The backend is configured to accept requests from:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- File:// protocol (for local HTML files)

### File Upload Returns Empty Keywords
- Check if the file format is supported
- Verify the file is not corrupted
- For images, ensure Tesseract is installed
- Check logs for specific extraction errors

## Future Enhancements
- Integration with AI models (GPT, Gemini, etc.) for intelligent question generation
- Support for more file formats (RTF, ODT, EPUB)
- User authentication and file management
- Database to store keywords and questions
- Advanced filtering and question customization
- Multilingual support

## Notes
- All uploaded files are stored in `backend/data/uploads/`
- Generated exports are stored in `backend/outputs/`
- Files are referenced by UUID for security and uniqueness
- CORS is enabled for local development
