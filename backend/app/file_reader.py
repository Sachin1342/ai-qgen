"""
File reading utilities to extract text from various file formats
"""
import os
import io
from pathlib import Path
from typing import Dict, Tuple

# PDF handling
try:
    import pdfplumber
except ImportError:
    pdfplumber = None

# DOCX handling
try:
    from docx import Document
except ImportError:
    Document = None

# Image OCR handling
try:
    from PIL import Image
    import pytesseract
except ImportError:
    Image = None
    pytesseract = None


def read_pdf(file_path: str) -> str:
    """Extract text from PDF files"""
    if not pdfplumber:
        raise ImportError("pdfplumber not installed. Install with: pip install pdfplumber")

    text = []
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text.append(page_text)
        return "\n".join(text)
    except Exception as e:
        raise ValueError(f"Error reading PDF: {str(e)}")


def read_docx(file_path: str) -> str:
    """Extract text from DOCX files"""
    if not Document:
        raise ImportError("python-docx not installed. Install with: pip install python-docx")

    text = []
    try:
        doc = Document(file_path)
        for paragraph in doc.paragraphs:
            text.append(paragraph.text)
        return "\n".join(text)
    except Exception as e:
        raise ValueError(f"Error reading DOCX: {str(e)}")


def read_text_file(file_path: str) -> str:
    """Extract text from plain text files (.txt, .md, etc)"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        # Try with different encoding
        with open(file_path, 'r', encoding='latin-1') as f:
            return f.read()
    except Exception as e:
        raise ValueError(f"Error reading text file: {str(e)}")


def read_image(file_path: str) -> str:
    """Extract text from image files using OCR"""
    if not Image or not pytesseract:
        raise ImportError("Pillow and pytesseract not installed. Install with: pip install Pillow pytesseract")

    try:
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        raise ValueError(f"Error reading image with OCR: {str(e)}")


def extract_text_from_file(file_path: str) -> str:
    """
    Smart file type detection and text extraction
    Supports: PDF, DOCX, TXT, MD, JPG, PNG, GIF, BMP, and more
    """
    file_ext = Path(file_path).suffix.lower()

    if file_ext == '.pdf':
        return read_pdf(file_path)
    elif file_ext == '.docx':
        return read_docx(file_path)
    elif file_ext in ['.txt', '.md', '.csv', '.json', '.xml', '.html', '.py', '.js', '.cpp', '.java']:
        return read_text_file(file_path)
    elif file_ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp']:
        return read_image(file_path)
    else:
        # Try reading as text first, fallback to OCR if it's an image
        try:
            return read_text_file(file_path)
        except:
            try:
                return read_image(file_path)
            except:
                raise ValueError(f"Unsupported file format: {file_ext}")
