# Quick Start & Testing Guide

## 🚀 Getting Started

### Start the Backend
```bash
# Install dependencies (first time only)
cd backend
pip install -r requirements.txt

# Run the backend
python -m app.main
```

You should see:
```
🚀 Starting AI-QGen Backend on http://127.0.0.1:8001
📝 Generate endpoint: POST /api/generate
📤 Upload endpoint: POST /api/upload
📥 Export endpoints: POST /api/export/pdf, POST /api/export/docx
💊 Health check: GET /api/health
```

### Open Frontend
- Open `frontend/index.html` in your browser, OR
- Open with a local server: `python -m http.server 3000`

---

## ✅ Test Upload Functionality

### Method 1: Click Upload Zone
1. Open browser DevTools (F12) → Console tab
2. Click the upload zone (blue dashed box)
3. Select any file from your computer
4. Watch the console for logs

**Expected Console Output:**
```
📂 Upload zone clicked - opening file picker...
📄 File selected: filename.pdf
   Size: 150.25 KB
   Type: application/pdf
→ POST http://127.0.0.1:8001/api/upload
← Response status: 200
✅ Keywords extracted: 20
✅ Word count: 5234
✅ Upload successful!
```

### Method 2: Drag & Drop
1. Open browser DevTools → Console tab
2. Drag a file and drop it on the upload zone
3. Watch the console

**Expected Behavior:**
- Zone should highlight when dragging over
- File uploads automatically on drop

### Method 3: Test API with Curl
```bash
# Linux/Mac
curl -X POST -F "file=@/path/to/file.pdf" http://127.0.0.1:8001/api/upload

# Windows PowerShell
$file = Get-Item "C:\path\to\file.pdf"
$form = @{ file = $file }
Invoke-RestMethod -Uri "http://127.0.0.1:8001/api/upload" -Method Post -Form $form
```

---

## 🔍 Troubleshooting

### Issue: "File picker doesn't open"

**Check Console for Errors:**
1. Open DevTools (F12)
2. Look for any red error messages
3. Check if you see: "📂 Upload zone clicked"

**Solutions:**
- Refresh page (Ctrl+F5)
- Check if `hidden` attribute exists in `index.html` line 131
- Verify JavaScript loaded: Look for "✅ AI-QGen script loaded successfully!"

---

### Issue: "Upload fails with error"

**Check Backend:**
- Is backend running? Should see logs in terminal
- Try the API directly with curl (see above)
- Check backend console for error messages

**Common Errors:**

| Error | Solution |
|-------|----------|
| "Connection failed" | Start backend: `python -m app.main` |
| "File type not allowed" | Format not supported (should be in the list) |
| "No keywords extracted" | File might be empty or unreadable |
| "CORS error" | Check backend CORS settings for your origin |

---

### Issue: "Keywords not extracted"

**Check File:**
- Is the file corrupted or empty?
- Try with a simple .txt file first
- Check file size (should have content)

**Check Backend Logs:**
- Look for extraction errors in terminal
- For PDFs: Make sure pdfplumber installed
- For Images: Make sure pytesseract and Tesseract installed

---

## 🧪 Minimal Test Files

Create these test files to verify functionality:

### Test 1: Simple Text File
Create `test.txt`:
```
Machine Learning is a subset of artificial intelligence.
It focuses on training systems to learn from data.
Neural networks are inspired by biological neurons.
Deep learning uses multiple layers of neural networks.
```

Upload and verify keywords are extracted.

### Test 2: Check Browser Network Tab
1. Open DevTools → Network tab
2. Upload a file
3. Find the request to `/api/upload`
4. Check:
   - Method: POST
   - Status: 200 (success) or 400/500 (error)
   - Response tab: See keywords returned

---

## 📋 Complete Test Sequence

1. **Backend Ready**
   - Terminal shows: "🚀 Starting AI-QGen Backend"
   - No error messages

2. **Frontend Loads**
   - Page displays without errors
   - Browser console shows: "✅ AI-QGen script loaded successfully!"

3. **Upload Works**
   - Click upload zone
   - File picker opens
   - Select test file
   - Console shows: "✅ Upload successful!"
   - Upload text shows: "✅ filename uploaded"

4. **Keywords Display**
   - Upload text shows word count and keyword count
   - Generate button becomes enabled

5. **Generate Works**
   - Click "Generate Questions" button
   - Console shows: "🔨 Generating questions"
   - Questions appear on page

6. **Export Works**
   - Click "Download PDF" or "Download DOCX"
   - File downloads successfully

---

## 🐛 Debug Checklist

- [ ] Backend running (check terminal)
- [ ] Backend listening on port 8001
- [ ] Frontend page loads without errors
- [ ] Browser console shows init logs
- [ ] File input has `hidden` attribute (index.html:131)
- [ ] uploadZone div has id="uploadZone"
- [ ] generate.js script loaded
- [ ] No CORS errors in browser console
- [ ] Test with simple .txt file first
- [ ] Check Network tab for API responses

---

## 💡 Tips

1. **Always check Browser Console (F12)**
   - Most issues visible here as errors
   - Contains helpful debug logs

2. **Always check Backend Terminal**
   - See incoming requests
   - Watch for upload errors
   - See file reading issues

3. **Test with Simple Files First**
   - .txt files are easiest to debug
   - PDFs need pdfplumber
   - Images need Tesseract OCR

4. **Use Network Tab**
   - See exact request/response
   - Check status codes
   - Verify Content-Type headers

5. **Check File Sizes**
   - Very small files might not extract keywords
   - Extremely large files might timeout
   - Balance needed for testing

---

## 🎯 Success Indicators

✅ File picker opens when clicking upload zone
✅ File uploads without errors
✅ Keywords displayed in upload message
✅ Generate button becomes enabled
✅ Questions generate successfully
✅ PDF/DOCX export works
✅ Console shows no red errors
✅ Backend terminal shows successful requests

---

## 📞 Still Having Issues?

Check these files in order:
1. `DEBUG_REPORT.md` - Detailed debugging info
2. `BACKEND_SETUP.md` - Backend configuration
3. Browser Console - Error messages
4. Backend Terminal - Server logs
5. Network Tab - Request/response details
