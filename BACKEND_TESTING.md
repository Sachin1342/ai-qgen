# Backend Testing Guide

## Quick Start

### Windows
1. Double-click: `backend/start-backend.bat`
2. Wait for dependencies to install
3. Backend starts automatically

### macOS/Linux
```bash
chmod +x backend/start-backend.sh
./backend/start-backend.sh
```

---

## Step-by-Step Testing

### Step 1: Install Dependencies

**Windows (Command Prompt/PowerShell):**
```bash
cd backend
pip install -r requirements.txt
```

**macOS/Linux:**
```bash
cd backend
pip3 install -r requirements.txt
```

Watch for messages like:
```
Successfully installed Flask-2.3.3 flask-cors-4.0.0 ...
```

✅ If no errors, proceed to Step 2

---

### Step 2: Start the Backend

**Run this command:**
```bash
python -m app.main
```

**Expected output:**
```
🚀 Starting AI-QGen Backend on http://127.0.0.1:8001
📝 Generate endpoint: POST /api/generate
📤 Upload endpoint: POST /api/upload
📥 Export endpoints: POST /api/export/pdf, POST /api/export/docx
💊 Health check: GET /api/health
 * Running on http://127.0.0.1:8001
```

**Leave this terminal running!** The backend must stay active while testing.

---

### Step 3: Test Health Check (In a new terminal)

**Windows (PowerShell):**
```powershell
Invoke-RestMethod http://127.0.0.1:8001/api/health
```

**macOS/Linux (bash):**
```bash
curl http://127.0.0.1:8001/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "AI-QGen backend is running"
}
```

✅ If you see this, backend is running!

---

### Step 4: Test File Upload

#### Create a test file:

**Windows (PowerShell):**
```powershell
@"
Machine Learning is a subset of Artificial Intelligence.
It focuses on training systems to learn from data without being explicitly programmed.
Neural Networks are computational models inspired by biological neurons.
Deep Learning uses multiple layers of neural networks for complex pattern recognition.
"@ | Out-File test-document.txt -Encoding utf8
```

**macOS/Linux (bash):**
```bash
cat > test-document.txt << 'EOF'
Machine Learning is a subset of Artificial Intelligence.
It focuses on training systems to learn from data without being explicitly programmed.
Neural Networks are computational models inspired by biological neurons.
Deep Learning uses multiple layers of neural networks for complex pattern recognition.
EOF
```

#### Upload the file:

**Windows (PowerShell):**
```powershell
$form = @{ file = Get-Item "test-document.txt" }
$response = Invoke-RestMethod -Uri "http://127.0.0.1:8001/api/upload" -Method Post -Form $form
$response | ConvertTo-Json
```

**macOS/Linux (bash):**
```bash
curl -X POST -F "file=@test-document.txt" http://127.0.0.1:8001/api/upload | python3 -m json.tool
```

**Expected response:**
```json
{
  "file_id": "abc123-def456-ghi789",
  "file_name": "test-document.txt",
  "keywords": [
    "machine",
    "learning",
    "artificial",
    "intelligence",
    "neural",
    "networks",
    "deep",
    ...
  ],
  "word_count": 45,
  "message": "File uploaded and processed successfully"
}
```

✅ If you see keywords and word count, upload works!

---

### Step 5: Test Question Generation

**Windows (PowerShell):**
```powershell
$body = @{
    keywords = @("machine", "learning", "neural", "networks")
    count = 5
    difficulty = "medium"
    qtype = "mcq"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8001/api/generate" `
  -Method Post `
  -Body $body `
  -ContentType "application/json" | ConvertTo-Json
```

**macOS/Linux (bash):**
```bash
curl -X POST http://127.0.0.1:8001/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": ["machine", "learning", "neural", "networks"],
    "count": 5,
    "difficulty": "medium",
    "qtype": "mcq"
  }' | python3 -m json.tool
```

**Expected response:**
```json
{
  "questions": [
    {
      "question": "1. What is machine?",
      "options": [
        "Definition of machine",
        "Alternative concept 1",
        "Alternative concept 2",
        "Incorrect definition"
      ],
      "answer": "a) Definition of machine"
    },
    ...
  ],
  "count": 5,
  "message": "Questions generated successfully"
}
```

✅ If you see questions, generation works!

---

### Step 6: Test Full Workflow in Frontend

1. **Open frontend**: Open `frontend/index.html` in your browser
2. **Configure**: Select university, format, subject, etc.
3. **Upload**: Click upload zone (should now work!)
4. **Generate**: Click "Generate Questions"
5. **Export**: Download as PDF or DOCX

---

## Testing Checklist

- [ ] Dependencies installed without errors
- [ ] Backend starts with no errors
- [ ] Health check returns `{"status": "ok"}`
- [ ] Text file uploads successfully
- [ ] Keywords extracted correctly
- [ ] Word count is correct
- [ ] Question generation works
- [ ] Frontend can upload and generate
- [ ] PDF export works
- [ ] DOCX export works

---

## Supported File Formats for Testing

### Start with these (easiest):
- ✅ **TXT** - Plain text files
- ✅ **MD** - Markdown files

### Then test:
- ✅ **PDF** - If pdfplumber installed
- ✅ **DOCX** - If python-docx installed
- ✅ **Images** - If Tesseract installed (JPG, PNG, GIF)
- ✅ **CSV** - Comma-separated values
- ✅ **JSON** - JSON documents

### Create test files:

**Simple TXT:**
```bash
echo "Machine Learning Neural Networks Deep Learning" > simple.txt
```

**PDF:** Use any existing PDF file

**DOCX:** Create in Microsoft Word or Google Docs

---

## Common Issues & Solutions

### Issue: "Connection refused"
```
Error: connect ECONNREFUSED 127.0.0.1:8001
```
**Solution**: Backend not running
- Make sure backend terminal shows: "Running on http://127.0.0.1:8001"
- Terminate any other process on port 8001

### Issue: "Module not found"
```
ModuleNotFoundError: No module named 'flask'
```
**Solution**: Dependencies not installed
```bash
pip install -r requirements.txt
```

### Issue: "File type not allowed"
```json
{"detail": "File type not allowed. Supported formats: ..."}
```
**Solution**: File extension not in allowed list
- Check BACKEND_INSTALLATION.md for supported formats
- Or add your extension to `backend/app/api/upload.py`

### Issue: "No keywords extracted"
**Solution**: File is empty or unreadable
- Test with simple .txt file first
- Make sure file has content
- Check file permissions

### Issue: CORS error in browser
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: CORS already enabled
- Make sure backend is running
- Open frontend from local file or localhost
- Check browser console for other errors

---

## Performance Notes

- **First upload**: May take a moment (libraries loading)
- **PDF processing**: Slower than text files
- **Large files**: May timeout (try files < 5MB)
- **Keyword extraction**: ~20 keywords per file

---

## Debug Mode

To see more detailed logs, add this to `backend/app/main.py`:

```python
app.run(debug=True, host='127.0.0.1', port=8001)
```

Now all file uploads and API calls will be logged.

---

## Next Steps After Testing

✅ Backend working?
- Verify all file types can upload
- Test keyword extraction quality
- Test question generation

🔄 Ready for AI integration?
- Replace template-based generation with GPT/Gemini
- Add user authentication
- Add database for persistence
- Deploy to server

---

## Testing Timeline

| Task | Time |
|------|------|
| Install dependencies | 5-10 min |
| Start backend | 1 min |
| Health check | 1 min |
| Upload test | 2 min |
| Generate test | 2 min |
| Full workflow test | 5 min |
| **Total** | **~20 min** |

---

## Success Indicators

✅ Backend running without errors
✅ All test files upload successfully
✅ Keywords extracted from files
✅ Questions generate correctly
✅ Frontend can communicate with backend
✅ Export PDF/DOCX works
✅ No CORS or connection errors

🎉 If all green, backend is ready!
