"""
Upload API endpoint - handles file uploads and keyword extraction
"""
import os
import uuid
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from pathlib import Path

from app.file_reader import extract_text_from_file
from app.keyword_extractor import extract_keywords, count_words, sanitize_text

upload_bp = Blueprint('upload', __name__, url_prefix='/api')

# Configuration
UPLOAD_FOLDER = 'backend/data/uploads'
ALLOWED_EXTENSIONS = {
    'txt', 'md', 'pdf', 'docx', 'doc', 'xlsx', 'csv',
    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp',
    'json', 'xml', 'html', 'py', 'js', 'cpp', 'java', 'c', 'h'
}

# Ensure upload folder exists
Path(UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)


def allowed_file(filename: str) -> bool:
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@upload_bp.route('/upload', methods=['POST'])
def upload():
    """
    Upload a file and extract keywords

    Returns:
        - keywords: List of extracted keywords
        - word_count: Total word count in the file
        - file_name: Original filename
        - file_id: Unique identifier for the file
    """
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({'detail': 'No file provided'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'detail': 'No file selected'}), 400

        if not allowed_file(file.filename):
            return jsonify({
                'detail': f'File type not allowed. Supported formats: {", ".join(ALLOWED_EXTENSIONS)}'
            }), 400

        # Generate unique filename
        file_id = str(uuid.uuid4())
        file_ext = file.filename.rsplit('.', 1)[1].lower()
        saved_filename = f"{file_id}.{file_ext}"
        file_path = os.path.join(UPLOAD_FOLDER, saved_filename)

        # Save file
        file.save(file_path)

        # Extract text from file
        text = extract_text_from_file(file_path)

        if not text or len(text.strip()) == 0:
            os.remove(file_path)
            return jsonify({'detail': 'File is empty or no text could be extracted'}), 400

        # Sanitize text
        text = sanitize_text(text)

        # Extract keywords
        keywords = extract_keywords(text, num_keywords=20)

        # Count words
        word_count = count_words(text)

        # Store file info for later use
        file_info = {
            'file_id': file_id,
            'file_name': file.filename,
            'file_path': file_path,
            'text': text,
            'keywords': keywords,
            'word_count': word_count
        }

        return jsonify({
            'file_id': file_id,
            'file_name': file.filename,
            'keywords': keywords,
            'word_count': word_count,
            'message': 'File uploaded and processed successfully'
        }), 200

    except Exception as e:
        return jsonify({'detail': f'Upload error: {str(e)}'}), 500
