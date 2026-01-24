from fastapi import APIRouter, UploadFile, File
from pathlib import Path
import re
from collections import Counter

router = APIRouter()

UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/upload")
def upload(file: UploadFile = File(...)):
    raw = file.file.read()
    (UPLOAD_DIR / file.filename).write_bytes(raw)

    text = raw.decode("utf-8", errors="ignore")

    words = re.findall(r"\b[a-zA-Z]{4,}\b", text.lower())
    keywords = [w for w, _ in Counter(words).most_common(20)]

    return {
        "filename": file.filename,
        "keywords": keywords
    }
