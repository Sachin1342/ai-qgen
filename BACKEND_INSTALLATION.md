# Backend Setup & Installation Guide

## Step 1: Install Python Dependencies

### Windows (PowerShell or Command Prompt)
```bash
cd backend
pip install -r requirements.txt
```

### macOS/Linux (Terminal)
```bash
cd backend
pip install -r requirements.txt
```

### What Gets Installed
- **Flask** - Web framework
- **flask-cors** - Handle cross-origin requests
- **pdfplumber** - Extract text from PDF files
- **python-docx** - Read DOCX documents
- **Pillow** - Image processing
- **pytesseract** - OCR for images
- **nltk** - Natural Language Toolkit
- **requests** - HTTP requests

---

## Step 2: (Optional) Install Tesseract for Image OCR

If you want to support **image file uploads with text extraction**, install Tesseract:

### Windows
1. Download installer: https://github.com/UB-Mannheim/tesseract/wiki
2. Run the installer
3. Accept default installation path
4. Done!

### macOS
```bash
brew install tesseract
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install tesseract-ocr
```

**Note**: If Tesseract is not installed, PDFs and text files will still work - only image OCR will be skipped.

---

## Step 3: Start the Backend

### Run the backend server:
```bash
python -m app.main
```

Or alternatively:
```bash
python backend/app/main.py
```

### Expected Output:
```
🚀 Starting AI-QGen Backend on http://127.0.0.1:8001
📝 Generate endpoint: POST /api/generate
📤 Upload endpoint: POST /api/upload
📥 Export endpoints: POST /api/export/pdf, POST /api/export/docx
💊 Health check: GET /api/health
 * Running on http://127.0.0.1:8001
```

---

## Step 4: Test the Backend

### Test 1: Health Check
```bash
# Test if backend is running
curl http://127.0.0.1:8001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "AI-QGen backend is running"
}
```

### Test 2: File Upload with Curl

#### Windows (PowerShell)
```powershell
# Create a test text file first
@"
Machine Learning is a subset of Artificial Intelligence.
Neural Networks are inspired by biological neurons.
Deep Learning uses multiple layers of neural networks.
"@ | Out-File test.txt -Encoding utf8

# Upload the file
$form = @{ file = Get-Item "test.txt" }
Invoke-RestMethod -Uri "http://127.0.0.1:8001/api/upload" -Method Post -Form $form
```

#### macOS/Linux (bash)
```bash
# Create a test text file first
echo "Machine Learning is a subset of Artificial Intelligence.
Neural Networks are inspired by biological neurons.
Deep Learning uses multiple layers of neural networks." > test.txt

# Upload the file
curl -X POST -F "file=@test.txt" http://127.0.0.1:8001/api/upload
```

Expected response:
```json
{
  "file_id": "abc123-def456",
  "file_name": "test.txt",
  "keywords": ["machine", "learning", "neural", "networks", "deep", ...],
  "word_count": 25,
  "message": "File uploaded and processed successfully"
}
```

### Test 3: Generate Questions
```bash
curl -X POST http://127.0.0.1:8001/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": ["machine", "learning", "neural", "networks"],
    "count": 5,
    "difficulty": "medium",
    "qtype": "mcq"
  }'
```

---

## Directory Structure

```
backend/
├── app/
│   ├── __init__.py              # Flask app factory
│   ├── main.py                  # Entry point
│   ├── file_reader.py           # File reading utilities
│   ├── keyword_extractor.py     # Keyword extraction
│   └── api/
│       ├── __init__.py
│       ├── upload.py            # File upload endpoint
│       ├── generate.py          # Question generation
│       └── export.py            # PDF/DOCX export
├── data/
│   └── uploads/                 # Uploaded files storage
├── outputs/
│   ├── pdf/                     # Generated PDFs
│   └── docx/                    # Generated DOCXs
└── requirements.txt             # Python dependencies
```

---

## API Endpoints Reference

### 1. Health Check
```
GET /api/health
```
Response: `{"status": "ok", "message": "..."}`

### 2. Upload File
```
POST /api/upload
Content-Type: multipart/form-data

Body: file=<binary>
```
Response:
```json
{
  "file_id": "uuid",
  "file_name": "document.pdf",
  "keywords": [...],
  "word_count": 1234
}
```

### 3. Generate Questions
```
POST /api/generate
Content-Type: application/json

{
  "keywords": ["word1", "word2"],
  "count": 10,
  "difficulty": "medium",
  "qtype": "mcq"
}
```

### 4. Export PDF
```
POST /api/export/pdf
Content-Type: application/json

{
  "title": "Generated Questions",
  "questions": [...]
}
```

### 5. Export DOCX
```
POST /api/export/docx
Content-Type: application/json

{
  "title": "Generated Questions",
  "questions": [...]
}
```

---

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'flask'"
**Solution**: Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Issue: "Address already in use"
**Solution**: Port 8001 is already in use. Kill the process:
```bash
# Windows
netstat -ano | findstr :8001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8001
kill -9 <PID>
```

### Issue: "CORS error in browser"
**Solution**: Backend is configured for CORS. Make sure you're accessing from:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `file://` (local HTML files)

### Issue: "pytesseract error"
**Solution**: Tesseract not installed or wrong path
- Install Tesseract (see Step 2 above)
- Or ignore - PDFs and text will still work

### Issue: "pdfplumber error"
**Solution**:
```bash
pip install --upgrade pdfplumber
```

---

## File Upload Support

### Text Files
- .txt, .md, .csv, .json, .xml, .html
- Source code: .py, .js, .cpp, .java, .c, .h
✅ Works: Automatic extraction

### Documents
- .pdf (requires pdfplumber)
- .docx, .doc (requires python-docx)
✅ Works: Text extraction

### Images
- .jpg, .jpeg, .png, .gif, .bmp, .tiff, .webp
✅ Works with OCR: Requires Tesseract (optional)

### Unsupported
- Binary executables
- Encrypted files
- Very large files (>500MB)

---

## Performance Tips

1. **Use smaller files first** - Test with .txt files
2. **Keyword count** - Default is 20, can be adjusted in keyword_extractor.py
3. **Question generation** - Currently template-based, update for AI integration
4. **File cleanup** - Old uploads stored in `backend/data/uploads/`
5. **Export files** - PDFs and DOCXs stored in `backend/outputs/`

---

## Next Steps

1. ✅ Install dependencies (`pip install -r requirements.txt`)
2. ✅ Start backend (`python -m app.main`)
3. ✅ Test health check (curl or browser)
4. ✅ Test file upload with sample file
5. ✅ Open frontend and test full workflow
6. 🔄 Integrate with AI model (GPT, Gemini, etc.) for better questions

---

## Integration with AI Models

To generate better questions using AI, update `backend/app/api/generate.py`:

```python
# Example with OpenAI
import openai

def generate_with_ai(keywords, count, difficulty):
    prompt = f"Generate {count} {difficulty} questions about: {', '.join(keywords)}"
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
```

---

## Logs & Debugging

Backend logs appear in the terminal where you ran `python -m app.main`.

Look for:
- `POST /api/upload 200` - Successful upload
- `POST /api/generate 200` - Successful generation
- `ERROR` - Any errors during processing
- `WARNING` - Potential issues

---

## Summary

✅ Backend supports any file format
✅ Automatic keyword extraction
✅ Question generation (template-based)
✅ PDF/DOCX export
✅ Comprehensive error handling
✅ CORS enabled for frontend

Ready to start testing! 🚀
